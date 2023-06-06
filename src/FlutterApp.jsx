import { useMatches } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const createScriptTag = (url) => {
  const scriptTag = document.createElement("script")
  scriptTag.type = "application/javascript"
  scriptTag.src = url

  const regex = /\/([^/]+)\.js$/
  const match = url.match(regex)
  const result = match[1].replace(".", "_")

  scriptTag.setAttribute(result, "")
  document.body.append(scriptTag)

  return result
}
const deleteScriptTag = (tag) => {
  const scriptTags = document.querySelectorAll(`script[${tag}]`)
  scriptTags.forEach((scriptTag) => {
    scriptTag.remove()
  })
}
const setBaseUri = (baseUri) => {
  let baseElement = document.querySelector("base")
  if (!baseElement) {
    baseElement = document.createElement("base")
    document.head.appendChild(baseElement)
  }
  baseElement.href = baseUri
}

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

export const FlutterApp = ({ appDir, style = {} }) => {
  const matches = useMatches()
  const match = matches[matches.length - 1]

  const baseUri = match.pathname.endsWith("/") ? match.pathname : match.pathname.concat("/")
  const { flutterTarget, loaded } = useFlutter({ baseUri, appDir, confusion: match.handle.confusion })
  return (
    <div
      ref={flutterTarget}
      style={{
        ...{ visibility: loaded ? "visible" : "hidden" },
        height: "100vh",
        width: "100vw",
        ...style,
      }}
    />
  )
}
