import { useState, useEffect, useRef } from "react"
import { setBaseUri, createScriptTag, deleteScriptTag } from "./dom"

const useFlutter = ({ appDir, baseUri, confusion }) => {
  const flutterTarget = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
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
    const scriptTag = createScriptTag(entrypointUrl)

    const setState = (event) => {
      confusion(event.detail)
      setLoaded(true)
      flutterTarget.current.removeEventListener("flutter-initialized", setState)
    }
    flutterTarget.current.addEventListener("flutter-initialized", setState)

    return () => deleteScriptTag(scriptTag)
  }, [flutterTarget, appDir, baseUri, confusion])

  return { flutterTarget, loaded }
}
export default useFlutter
