import { useMatches } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const createScriptTag = (url) => {
  const scriptTag = document.createElement("script")
  scriptTag.type = "application/javascript"
  scriptTag.src = url
  const match = url.match(/\/([^/]+)\.js$/)
  const result = match[1].replace(".", "_")
  scriptTag.setAttribute(result, "")
  document.body.append(scriptTag)
  return result
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
    let appRunner
    setBaseUri(baseUri)
    const didCreateEngineInitializer = async (engineInitializer) => {
      appRunner = await engineInitializer.initializeEngine({
        hostElement: flutterTarget.current,
        assetBase: `/${appDir}/`,
      })
      await appRunner.runApp()
    }
    window._flutter = { loader: { didCreateEngineInitializer } }
    if (confusion) {
      const setState = (event) => {
        confusion(event.detail)
        setLoaded(true)
        flutterTarget.current.removeEventListener("flutter-initialized", setState)
      }
      flutterTarget.current.addEventListener("flutter-initialized", setState)
    } else setLoaded(true)
    const scriptTag = createScriptTag(`/${appDir}/main.dart.js`)
    return () => {
      document.querySelectorAll(`script[${scriptTag}]`).forEach((tag) => tag.remove())
      document.querySelectorAll("label[id=ftl-announcement-polite]").forEach((tag) => tag.remove())
      document.querySelectorAll("label[id=ftl-announcement-assertive]").forEach((tag) => tag.remove())
      appRunner = null
      delete window._flutter
    }
  }, [flutterTarget, appDir, baseUri, confusion])
  return { flutterTarget, loaded }
}

const getBaseUri = (match) => {
  const { params, pathname } = match
  if (params["*"]) {
    const base = pathname.replace(params["*"], "")
    return base.endsWith("/") ? base : base.concat("/")
  }
  const baseUri = match.pathname.endsWith("/") ? match.pathname : match.pathname.concat("/")
  return baseUri
}

export const FlutterApp = ({ appDir, style = {} }) => {
  const matches = useMatches()
  const match = matches[matches.length - 1]
  const baseUri = getBaseUri(match)
  const { flutterTarget, loaded } = useFlutter({ baseUri, appDir, confusion: match.handle?.confusion })
  return (
    <div
      ref={flutterTarget}
      style={{
        ...{ visibility: loaded ? "visible" : "hidden" },
        height: "100%",
        width: "100%",
        overscrollBehavior: "contain",
        overscrollBehaviorY: "contain",
        ...style,
      }}
    />
  )
}
export default FlutterApp
