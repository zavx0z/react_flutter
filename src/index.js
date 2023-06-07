import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import { types } from "mobx-state-tree"
import counter from "./atoms/counter"

const root = ReactDOM.createRoot(document.getElementById("root"))

const everything = types
  .model("everything", {
    counter: types.maybeNull(counter),
  })
  .create({})

root.render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/counter",
        shouldRevalidate: false,
        async lazy() {
          const { Counter, handle, loader } = await import("./Counter")
          return {
            loader: loader(everything),
            handle: handle(everything),
            element: (
              <Counter counter={everything.counter}>
                <Link to="/app">App</Link>
              </Counter>
            ),
          }
        },
      },
      {
        path: "/app",
        shouldRevalidate: false,
        async lazy() {
          const { Counter, handle, loader } = await import("./Counter")
          return {
            loader: loader(everything),
            handle: handle(everything),
            element: (
              <Counter counter={everything.counter}>
                <Link to="/counter">Counter</Link>
              </Counter>
            ),
          }
        },
      },
    ])}
  />
)
