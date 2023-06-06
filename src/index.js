import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { createBrowserRouter, Link, RouterProvider, Outlet, defer } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/hook",
        loader: () => {
          console.log("root")
          return true
        },
        handle: {
          store: (rootStore, appStore) => {
            return { rootStore, appStore }
          }
        },
        element: (
          <>
            <Link to="/loader">loader</Link>
            <App appDir={"flutter"} baseUri={"/hook/"} />
          </>
        ),
      },
      {
        loader: () => {
          console.log("loader")
          return true
        },
        Component: () => {
          console.log("app")
          return (
            <>
              <div id="flutterPortal" style={{ width: "100%", height: "100%" }} />
              <Outlet />
            </>
          )
        },
        children: [
          {
            path: "/loader",
            // async lazy() {
            //   console.log("loader//")
            //   const { loader, Component } = await import("./Flutter")
            //   return { loader: loader('/loader/', '/flutter', '/flutter/main.dart.js'), Component }
            // },
            loader: async () => {
              setTimeout(() => console.log(document.getElementById("flutterPortal")), 10)
              return defer({ success: true })
            },
            Component: () => {
              console.log("app/loader")
              return <>hi</>
            },
          },
        ],
      },
    ])}
  />
)
