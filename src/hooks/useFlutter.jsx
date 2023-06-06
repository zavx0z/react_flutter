import { useEffect, useRef, useState } from "react"
import { setBaseUri, createScriptTag, deleteScriptTag } from "../utils/dom"

const useFlutter = ({ baseUri, assetBase }) => {
  const flutterTarget = useRef(null)
  useEffect(() => {
    let scriptTag
    if (!window._flutter) {
      const assetBaseNormalized = "/" + assetBase + "/"
      const entrypointUrl = assetBaseNormalized + "main.dart.js"
      setBaseUri(baseUri)
      const didCreateEngineInitializer = async (engineInitializer) => {
        let appRunner = await engineInitializer.initializeEngine({
          hostElement: flutterTarget.current,
          assetBase: assetBaseNormalized,
        })
        await appRunner.runApp()
      }
      window._flutter = { loader: { didCreateEngineInitializer } }
      scriptTag = createScriptTag(entrypointUrl)
    }
    return () => deleteScriptTag(scriptTag)
  }, [baseUri, flutterTarget, assetBase])
  const [flutterState, setFlutterState] = useState(null)
  useEffect(() => {
    console.log("rerender")
    if (flutterTarget.current) {
      const setState = (event) => {
        setFlutterState(event.detail)
        flutterTarget.current.removeEventListener("flutter-initialized", setState)
      }
      flutterTarget.current.addEventListener("flutter-initialized", setState)
    }
  }, [flutterTarget])
  return { flutterTarget, flutterState }
}
export default useFlutter
