import React, { useEffect } from 'react'
import { useValues, useActions } from 'kea'
import { useAccessors } from "../../runtime";
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import usersLogic from '../users/usersLogic'

import styles from './NotificationsList.module.css'

import notificationsLogic from './notificationsLogic'

export const NotificationsList = () => {
  const {selectAllNotifications}  = useValues(notificationsLogic)
  const {allNotificationsRead}  = useActions(notificationsLogic)
  const {selectUserById} = useAccessors(usersLogic)
  const notifications = selectAllNotifications

  useEffect(() => {
    allNotificationsRead()
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = selectUserById(notification.user)

    const notificationClassname = classnames(styles.notification, {
      [styles.new]: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div className={styles.date} title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className={styles.notificationsList}>
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
