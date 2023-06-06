import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
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
        path: "/",
        shouldRevalidate: false,
        async lazy() {
          const { Counter, handle, loader, shouldRevalidate } = await import("./Counter")
          return {
            loader: loader(everything),
            handle: handle(everything),
            element: <Counter counter={everything.counter} />,
          }
        },
      },
    ])}
  />
)
