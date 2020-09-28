import React from 'react'

import { Link } from 'react-router-dom'

import usersLogic from '../users/usersLogic'
import postsLogic from '../posts/postsLogic'
import {useAccessors} from "../../runtime";

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const {selectPostsForUser} = useAccessors(postsLogic)
  const {selectUserById} = useAccessors(usersLogic)
  const user = selectUserById(userId)

  const postsForUser = selectPostsForUser(userId)

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
