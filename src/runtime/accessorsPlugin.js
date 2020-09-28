const plugin = () => ({
  name: 'accessors',

  defaults: () => ({
    accessors: {}
  }),

  buildOrder: {
    accessors: {after: 'values'}
  },

  buildSteps: {
    // this is run before the steps that convert input into logic
    accessors(logic, input) {
      // skip if there's no `accessors` in the input
      if (!input.accessors) {
        return
      }

      const accessorCreators = typeof input.accessors === 'function'
        ? input.accessors(logic)
        : input.accessors

      //console.log("buildSteps.accessors", accessorCreators, logic, input)

      Object.keys(accessorCreators).forEach(key => {
        logic.accessors[key] = createAccessor(
          `${key} (${logic.pathString})`,
          accessorCreators[key]
        )
      })
    }
  },

  events: {
    afterPlugin() {
      //setPluginContext('accessors', {})
      //console.log("events.afterPlugin", getContext())
    },
    // this is run after the steps that convert input into logic
    afterLogic(logic, input) {
      //console.log("events.afterLogic", logic, input)
    }
  }
})

function useAccessors(logic) {
  const boundAccessors = {}
  //console.log("useAccessors", logic)
  if (logic.accessors) {
    for (const key of Object.keys(logic.accessors)) {
      const accessor = logic.accessors[key]
      boundAccessors[key] = (...args) => accessor(...args);
    }
  }
  return boundAccessors
}

export default {
  useAccessors,
  plugin
}

function createAccessor(key, accessor) {
  return accessor;
}