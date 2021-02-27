import React from 'react'
import { useSession } from 'next-auth/client'
import LoginPage from '../login/index'
import { useQuery, gql } from '@apollo/client'
import { Spin } from 'antd'
import { Button } from 'antd'
import Link from 'next/link'

const GET_STORIES = gql`
  query stories($data: StoryWhereInput!) {
    stories(where: $data) {
      id
      title
    }
  }
`

const StoryPage = () => {
  const [session, loading] = useSession()
  const { loading: isLoading, error: storyError, data } = useQuery(GET_STORIES, {
    variables: {
      data: {
        authorId: {
          equals: session?.id,
        },
      },
    },
  })

  if (isLoading || loading) return <Spin />

  if (storyError) return <p>Error ${storyError}</p>

  if (session && data?.stories?.length > 0)
    return (
      <>
        <ul>
          {data?.stories?.map((story) => {
            return <li key={story.id}>{story.title}</li>
          })}
        </ul>

        {!data.stories.length && <p>You don&apos;t have any Stories yet!</p>}
        <Link href="/story/create" passHref>
          <Button type="primary" htmlType="button">
            Create New
          </Button>
        </Link>
      </>
    )
}

export default StoryPage