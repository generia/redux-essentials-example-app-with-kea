import { client } from '../../api/client'
import {kea} from "kea";
import {immerify} from "../../runtime";

export default kea({
  defaults: {
    users: {
      ids: [],
      entities: {},
      status: 'idle',
      error: undefined
    }
  },
  actions: () => ({
    fetchUsers: true,
    setUsers: users => ({users}),
    setStatus: status => ({status})
  }),
  reducers: () => ({
    users: {
      setUsers: immerify ((_users, { users }) => {
        _users.ids = []
        _users.entities = {}
        if (users) {
          users.map(user => {
            const id = user.id
            _users.ids.push(id)
            _users.entities[id] = user
          })
        }
        console.log('setUsers: ', users, _users)
      }),
      setStatus: immerify((_notifications, { status }) => {
        _notifications.status = status
      })
    }
  }),
  selectors: ({ selectors }) => ({
    selectAllUsers: [() => [selectors.users], (users) => {
      return Object.values(users.entities)
    }]
  }),
  listeners: ({ actions }) => ({
    fetchUsers: async () => {
      actions.setStatus('loading')
      const response = await client.get('/fakeApi/users')
      actions.setUsers(response.users)
      actions.setStatus('succeeded')
    }
  }),
  accessors: ({values}) => ({
    selectUserById(id) {
      const entities = values.users.entities;
      return entities[id]
    }
  })
});
