import { useState } from "react"
import { useLoaderData } from "react-router-dom"
import { setBaseUri, createScriptTag } from "./utils/dom"

export const loader = async (baseUri, assetBase, entrypointUrl) => {
  console.log(baseUri, assetBase, entrypointUrl)
  const target =  new Promise((resolve, reject) => {
    setBaseUri(baseUri)
    let flutterTarget = document.getElementById("flutterPortal")
    console.log(flutterTarget)
    // const didCreateEngineInitializer = async (engineInitializer) => {
    //   let appRunner = await engineInitializer.initializeEngine({
    //     hostElement: flutterTarget,
    //     assetBase: assetBase,
    //   })
    //   await appRunner.runApp()
    //   resolve(flutterTarget)
    // }
    // window._flutter = { loader: { didCreateEngineInitializer } }
    // const scriptTag = createScriptTag(entrypointUrl)
    // console.log("🚀 ~ file: useFlutter.jsx:51 ~ loader ~ flutterTarget:", flutterTarget)
  })
  return{flutterTarget: target}
}
export const Component = () => {
  const [count, setCount] = useState(0)
  // const { flutterTarget, flutterState } = useLoaderData()
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div>
        <h1>{count}</h1>
        {/* <button onClick={() => flutterState.current.setClicks(count + 1)}>+</button> */}
      </div>
    </div>
  )
}
