import React from 'react'
import { useSession } from 'next-auth/client'
import { useQuery, gql } from '@apollo/client'
import { Card, Col, Row, Space, Spin } from 'antd'
import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Meta } from 'antd/lib/list/Item'
import Layout from 'antd/lib/layout/layout'

const GET_STORY = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
      subTitle
      thumbnail
      description
      part
      published
      series {
        title
      }
    }
  }
`

const EditPage = () => {
  const router = useRouter()

  const [session] = useSession()
  const { loading, error: storyError, data } = useQuery(GET_STORY, {
    variables: {
      data: {
        authorId: {
          equals: session?.id,
        },
        id: {
          equals: Number(router?.query?.storyId),
        },
      },
    },
  })

  if (loading) return <Spin />

  if (storyError) return <p>Error </p>

  if (data?.stories?.length > 0) {
    const story = data.stories[0]

    return (
      <>
        <Layout>
          <Row>
            <Col span={4}>{!data.stories.length && <p>You don&apos;t have any Stories yet!</p>}</Col>
            <Col span={14} push={1}></Col>
          </Row>
          <Row>
            <Col xs={24} xl={{ span: 4 }}>
              <Space direction="vertical">
                <Card
                  key={story.id}
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    story.thumbnail ? (
                      <img
                        alt={story.title}
                        src={`https://res.cloudinary.com/slashclick/image/upload/v1614654910/${story?.thumbnail}`}
                      />
                    ) : null
                  }
                >
                  <Meta title={story.title} description={story.subTitle} />
                </Card>
              </Space>
            </Col>
            <Col xs={24} xl={{ span: 16, push: 2, pull: 5 }}>
              <h1>{story.title}</h1>
              {story?.subTitle && <h2>{story.subTitle}</h2>}
              {story?.series?.title && (
                <h3>
                  {story.series.title} {story?.part && `Part ${story.part}`}
                </h3>
              )}
              {story?.description && <p>{story.description}</p>}

              <Space direction="horizontal">
                <Link href={`/stories/edit/${story.id}`} passHref>
                  <Button type="default" htmlType="button">
                    Edit Story
                  </Button>
                </Link>
                <Link href="/stories/create" passHref>
                  <Button type="primary" htmlType="button">
                    Create New
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Layout>
      </>
    )
  }
}

export default EditPage
