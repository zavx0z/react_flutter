import { useEffect, useRef, useState } from "react"
import { setBaseUri, createScriptTag, deleteScriptTag } from "../utils/dom"

const useFlutter = ({ appDir, baseUri }) => {
  const flutterTarget = useRef(null)
  useEffect(() => {
    let scriptTag
    if (!window._flutter) {
      setBaseUri(baseUri)
      const assetBaseNormalized = "/" + appDir + "/"
      const didCreateEngineInitializer = async (engineInitializer) => {
        let appRunner = await engineInitializer.initializeEngine({
          hostElement: flutterTarget.current,
          assetBase: assetBaseNormalized,
        })
        await appRunner.runApp()
      }
      window._flutter = { loader: { didCreateEngineInitializer } }

      const entrypointUrl = assetBaseNormalized + "main.dart.js"
      scriptTag = createScriptTag(entrypointUrl)
    }
    return () => deleteScriptTag(scriptTag)
  }, [flutterTarget, appDir, baseUri])

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
