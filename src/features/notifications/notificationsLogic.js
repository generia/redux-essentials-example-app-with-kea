import { client } from '../../api/client'
import {kea} from "kea";
import {immerify} from "../../runtime";

export default kea({
  defaults: {
    notifications: {
      ids: [],
      entities: {},
      status: 'idle',
      error: undefined
    }
  },
  actions: () => ({
    fetchNotifications: true,
    setNotifications: notifications => ({notifications}),
    setStatus: status => ({status}),
    allNotificationsRead: true
  }),
  reducers: ({accessors}) => ({
    notifications: {
      setNotifications: immerify ((_notifications, { notifications }) => {
        _notifications.ids = []
        _notifications.entities = {}
        if (notifications) {
          notifications.map(notification => {
            const id = notification.id
            _notifications.ids.push(id)
            _notifications.entities[id] = notification
          })
        }
      }),
      setStatus: immerify((_notifications, { status }) => {
        _notifications.status = status
      }),
      allNotificationsRead: immerify((_notifications) => {
        Object.values(_notifications.entities).forEach((notification) => {
          notification.read = true
        })
      })
    }
  }),
  selectors: ({ selectors }) => ({
    selectAllNotifications: [() => [selectors.notifications], (notifications) => {
      return Object.values(notifications.entities)
    }]
  }),
  listeners: ({ selectors, actions }) => ({
    fetchNotifications: async () => {
      actions.setStatus('loading')
      const [latestNotification] = selectors.selectAllNotifications()
      const latestTimestamp = latestNotification ? latestNotification.date : ''
      const response = await client.get(
        `/fakeApi/notifications?since=${latestTimestamp}`
      )
      actions.setNotifications(response.notifications)
      actions.setStatus('succeeded')
    },
    setStatus: (payload) => {
      //console.log("listeners.setStatus", payload)
      /*
      Object.values(state.entities).forEach((notification) => {
        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, action)
      */
    }
  })
});
