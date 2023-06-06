import { FlutterApp } from "./FlutterApp"
import { observer } from "mobx-react"
import { applyPatch, addMiddleware, types } from "mobx-state-tree"

export const counterModel = types
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

const RootAppCounter = observer(({ counter }) => <h2>{counter.count}</h2>)

export const Counter = ({ counter }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 100,
      }}>
      <RootAppCounter counter={counter} />
      <button onClick={counter.increment}>+</button>
      <FlutterApp
        appDir={"flutter"}
        style={{
          width: 444,
          height: 444,
          border: "1px solid black",
        }}
      />
    </div>
  )
}

export const handle = (everything) => ({
  confusion: (flutterStore) => {
    applyPatch(everything, { path: "/counter", op: "replace", value: { count: flutterStore.getClicks() } })
    flutterStore.onClicksChanged(() =>
      applyPatch(everything, {
        path: "/counter",
        op: "replace",
        value: { count: flutterStore.getClicks() },
      })
    )
    addMiddleware(everything.counter, (call, next) => {
      switch (call.name) {
        case "increment":
          return next(call, () => flutterStore.setClicks(call.context.count))
        default:
          return next(call)
      }
    })
  },
})

export const loader = (everything) => {
  applyPatch(everything, { path: "/counter", op: "add", value: {} })
  return null
}
