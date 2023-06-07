import { FlutterApp } from "./FlutterApp"
import { observer } from "mobx-react"
import { applyPatch, addMiddleware } from "mobx-state-tree"

export const loader = (everything) => {
  applyPatch(everything, { path: "/counter", op: "add", value: {} })
  return null
}
export const handle = (everything) => ({
  confusion: (app) => {
    applyPatch(everything, { path: "/counter", op: "replace", value: { count: app.getClicks() } })
    app.onClicksChanged(() =>
      applyPatch(everything, { path: "/counter", op: "replace", value: { count: app.getClicks() } })
    )
    addMiddleware(everything.counter, (call, next) => {
      switch (call.name) {
        case "increment":
          return next(call, () => app.setClicks(call.context.count))
        case "decrement":
          return next(call, () => app.setClicks(call.context.count))
        case "reset":
          return next(call, () => app.setClicks(call.context.count))
        default:
          return next(call)
      }
    })
  },
})

const RootAppCounter = observer(({ counter }) => <h2>{counter.count}</h2>)

export const Counter = ({ counter, children }) => {
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
      {children}
      <RootAppCounter counter={counter} />
      <div>
        <button onClick={counter.decrement}>-</button>
        <button onClick={counter.reset}>0</button>
        <button onClick={counter.increment}>+</button>
      </div>
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
