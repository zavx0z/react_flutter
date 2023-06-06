import { types } from "mobx-state-tree"

const counter = types
  .model({
    count: types.optional(types.number, 0),
  })
  .actions((self) => ({
    increment() {
      self.count++
    },
    decrement() {
      self.count--
    },
    reset() {
      self.count = 0
    },
    setCount(count) {
      self.count = count
    },
  }))
export default counter
