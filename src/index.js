import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <RouterProvider router={createBrowserRouter([
        {
            path: "/",
            loader: () => {
                console.log('root')
                return true
            },
            element: <>
                <App
                    assetBase={"/flutter/"}
                    entrypointUrl={"/flutter/main.dart.js"}
                />
            </>
        },
        {
            path: "/counter",
            loader: () => {
                console.log('counter')
                return true
            },
            element: <>
                <App
                    assetBase={"/flutter/"}
                    entrypointUrl={"/flutter/main.dart.js"}
                />
            </>
        }
    ])}/>
)
