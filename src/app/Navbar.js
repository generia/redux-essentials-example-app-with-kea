import React from 'react'
import { useValues, useActions } from 'kea'
import { Link } from 'react-router-dom'

import styles from './Navbar.module.css'

import postsLogic from '../features/posts/postsLogic'
import notificationsLogic from '../features/notifications/notificationsLogic'

export const Navbar = () => {
  const { selectAllPosts } = useValues(postsLogic)
  const { reloadAllPosts } = useActions(postsLogic)
  const { selectAllNotifications } = useValues(notificationsLogic)
  const { fetchNotifications } = useActions(notificationsLogic)

  const totalPosts = selectAllPosts.length
  const notifications = selectAllNotifications
  const numUnreadNotifications = notifications.filter((n) => !n.read).length

  const fetchNewNotifications = () => {
    fetchNotifications()
  }

  const refreshPosts = () => {
    reloadAllPosts()
  }

  let unreadNotificationsBadge

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Quick Start Example</h1>
        <p>build with <a href="https://kea.js.org">kea</a> based on <a href="https://github.com/reduxjs/redux-essentials-example-app">redux-toolkit example</a></p>
        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications
              {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={refreshPosts}>
            Refresh Posts
          </button>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
