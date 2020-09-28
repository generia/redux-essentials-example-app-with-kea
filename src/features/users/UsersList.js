import React from 'react'
import { useValues } from "kea";
import { Link } from 'react-router-dom'
import usersLogic from './usersLogic'

export const UsersList = () => {
  const {selectAllUsers} = useValues(usersLogic)
  const users = selectAllUsers
  console.log("UserList.users", users);
  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}
