import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import AppCopy from "./AppCopy";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/counter1",
        loader: () => {
          console.log("root");
          return true;
        },
        element: (
          <>
            <Link to="/counter2">counter2</Link>
            <App
              assetBase={"/flutter/"}
              entrypointUrl={"/flutter/main.dart.js"}
              baseUri={"/counter1/"}
            />
                        {/* <AppCopy
              assetBase={"/flutter2/"}
              entrypointUrl={"/flutter2/main2.dart.js"}
              baseUri={"/counter2/"}
            /> */}
          </>
        ),
      },
      {
        path: "/counter2",
        loader: () => {
          console.log("counter");
          return true;
        },
        element: (
          <>
            <Link to="/counter1">counter1</Link>
            <AppCopy
              assetBase={"/flutter/"}
              entrypointUrl={"/flutter/main.dart.js"}
              baseUri={"/counter2/"}
            />
          </>
        ),
      },
    ])}
  />
);
