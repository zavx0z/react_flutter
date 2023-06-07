import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import { types } from "mobx-state-tree"
import counter from "./atoms/counter"
import FlutterApp from "./FlutterApp"

const root = ReactDOM.createRoot(document.getElementById("root"))

const everything = types
  .model("everything", {
    counter: types.maybeNull(counter),
  })
  .create({})

const Home = () => {
  const normalizePath = (path) => {
    return path
  }
  return (
    <ul>
      {routes.filter(i=>i.path !== '/').map((route) => (
        <li key={route.path}>
        <Link to={normalizePath(route.path)}>
          {route.path}
        </Link>
        </li>
      ))}
    </ul>
  )
}

const routes = [
  {
    path: "/",
    loader: () => {
      console.log(routes)
      return null
    },
    Component: Home,
  },
  {
    path: "/kate-i-love-you!/*",
    element: <FlutterApp appDir={"route"} />,
  },
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
            <Link to="/">Home</Link>
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
            <Link to="/">Home</Link>
            <Link to="/counter">Counter</Link>
          </Counter>
        ),
      }
    },
  },
]

root.render(<RouterProvider router={createBrowserRouter(routes)} />)
