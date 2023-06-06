import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { types } from "mobx-state-tree"
import { counterModel } from "./Counter"

const root = ReactDOM.createRoot(document.getElementById("root"))

const everything = types
  .model("everything", {
    counter: types.maybeNull(counterModel),
  })
  .create({})

root.render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/",
        async lazy() {
          const { Counter, handle, loader } = await import("./Counter")
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
