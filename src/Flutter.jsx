import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Await, useLoaderData } from "react-router-dom"
import { setBaseUri, createScriptTag } from "./utils/dom"

export const loader = async (baseUri, assetBase, entrypointUrl) => {
  return new Promise((resolve, reject) => {
    console.log("🚀 ~ file: useFlutter.jsx:24 ~ loader ~ assetBase:", assetBase)
    setBaseUri(baseUri)
    let flutterTarget = document.getElementById("flutterPortal")
    // let flutterTarget = document.createElement("div");
    console.log("🚀 ~ file: useFlutter.jsx:32 ~ loader ~ flutterTarget:", flutterTarget.current)
    const didCreateEngineInitializer = async (engineInitializer) => {
      let appRunner = await engineInitializer.initializeEngine({
        hostElement: flutterTarget,
        assetBase: assetBase,
      })
      await appRunner.runApp()
      resolve(flutterTarget)
    }
    window._flutter = { loader: { didCreateEngineInitializer } }
    const scriptTag = createScriptTag(entrypointUrl)
    console.log("🚀 ~ file: useFlutter.jsx:51 ~ loader ~ flutterTarget:", flutterTarget)
  })
}
export const FlutterComponent = () => {
  const flutterState = useRef(null)
  const [count, setCount] = useState(0)
  const { flutterTarget } = useLoaderData()
  // useEffect(() => {
  //     if (window._flutter) {
  //         flutterTarget.current.addEventListener("flutter-initialized", (event)P=> {
  //             onFlutterAppLoaded(event)
  //         })`
  //         console.log(flutterTarget)
  //     }
  // }, [assetBase, entrypointUrl])
  const onFlutterAppLoaded = (event) => {
    flutterState.current = event.detail
    setCount(flutterState.current.getClicks())
    flutterState.current.onClicksChanged(() => setCount(flutterState.current.getClicks()))
  }
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
        <button onClick={() => flutterState.current.setClicks(count + 1)}>+</button>
      </div>
      <Await resolve={flutterTarget}>
        {(flutterTarget) => {
          console.log(flutterTarget)
          return createPortal(<></>, flutterTarget)

          //   <div
          //     // ref={flutterTarget}
          //     style={{
          //       width: 444,
          //       height: 444,
          //       border: "1px solid black",
          //     }}
          //   />
        }}
      </Await>
    </div>
  )
}
