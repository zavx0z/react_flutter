import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import {FlutterComponent, loader} from "./Flutter"
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/counter1",
        loader: () => {
          console.log("root")
          return true
        },
        element: (
          <>
            <Link to="/counter2">counter2</Link>
            <App assetBase={"flutter"} baseUri={"/counter1/"} />
          </>
        ),
      },
      {
        path: "/counter2",
        loader: async () => {
          return {
            flutterTarget: await loader("/counter2/", "/flutter/", "/flutter/main.dart.js")
          }
        },
        element: (
          <>
            <Link to="/counter1">counter1</Link>
            <FlutterComponent/>
          </>
        ),
      },
    ])}
  />
)
