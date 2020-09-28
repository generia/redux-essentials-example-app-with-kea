import React from 'react'
import { Link } from 'react-router-dom'
import { parseISO, formatDistanceToNow } from 'date-fns'

import { useValues } from "kea";
import { useAccessors } from "../../runtime";
import postsLogic from "./postsLogic";
import usersLogic from "../users/usersLogic";

import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  // eslint-disable-next-line no-unused-vars
  const {posts} = useValues(postsLogic) // workaroud to trigger render of the page

  const {selectPostById} = useAccessors(postsLogic)
  const {selectUserById} = useAccessors(usersLogic)
  const post = selectPostById(postId)

  const author = selectUserById(post ? post.user : null)

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const date = parseISO(post.date)
  const timeAgo = formatDistanceToNow(date)

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <span>
          <i>{author.name}</i>
        </span>
        <span title={post.date}>
          &nbsp; <i>{timeAgo} ago</i>
        </span>
        <p>{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
