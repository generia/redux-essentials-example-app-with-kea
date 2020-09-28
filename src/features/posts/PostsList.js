import React, { useEffect } from 'react'
import { useValues, useActions } from "kea";
import { useAccessors } from "../../runtime";
import postsLogic from "./postsLogic";
import usersLogic from "../users/usersLogic";

import { Link } from 'react-router-dom'
import { parseISO, formatDistanceToNow } from 'date-fns'

import { ReactionButtons } from './ReactionButtons'


const PostExcerpt = ({ postId }) => {
  const {selectPostById} = useAccessors(postsLogic)
  const {selectUserById} = useAccessors(usersLogic)
  const post = selectPostById(postId)
  const author = selectUserById(post.user)

  const date = parseISO(post.date)
  const timeAgo = formatDistanceToNow(date)

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <span>{author ? author.name : 'Unknown author!'}</span>
      <span title={post.date}>
        &nbsp; <i>{timeAgo} ago</i>
      </span>
      <p>{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const {posts, selectPostIds} = useValues(postsLogic)
  const {fetchPosts} = useActions(postsLogic)

  const postIds = selectPostIds
  const status = posts.status
  const error = posts.error

  // Sort posts in reverse chronological order
  const orderedPostIds = postIds.slice().reverse()

  useEffect(() => {
    if (status === 'idle') {
      fetchPosts()
    }
  }, [status])

  let content
  if (status === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (status === 'succeeded') {
    content = orderedPostIds.map((postId) => (
        <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (status === 'error') {
    content = <div>{error}</div>
  }

  return (
    <section>
      <h2>Posts</h2>

      {content}
    </section>
  )
}
