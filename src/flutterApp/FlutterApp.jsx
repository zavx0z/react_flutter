import useFlutter from "./useFlutter"
import { useMatches } from "react-router-dom"

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
