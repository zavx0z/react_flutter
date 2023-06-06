import { useEffect } from "react"
import useFlutter from "./hooks/useFlutter"
import { useMatches } from "react-router-dom"

const FlutterApp = ({ appDir, baseUri, style = {} }) => {
  const matches = useMatches()
  const match = matches[matches.length - 1]
  
  const { flutterTarget, flutterState } = useFlutter({
    baseUri: match.pathname.endsWith("/") ? match.pathname : match.pathname.concat("/"),
    appDir,
  })
  
  useEffect(() => {
    if (flutterState) {
      // setCount(flutterState.getClicks())
      // flutterState.onClicksChanged(() => setCount(flutterState.getClicks()))
    }
  }, [flutterState])
  return (
    <div
      ref={flutterTarget}
      style={{
        ...{ visibility: flutterState ? "visible" : "hidden" },
        height: "100%",
        width: "100%",
        ...style,
      }}
    />
  )
}

const App = ({ appDir, baseUri }) => {
  //   const [count, setCount] = useState(0)

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}>
      <div>
        {/* <h1>{count}</h1> */}
        {/* <button onClick={() => flutterState.setClicks(count + 1)}>+</button> */}
      </div>
      <FlutterApp
        appDir={appDir}
        baseUri={baseUri}
        style={{
          width: 444,
          height: 444,
          border: "1px solid black",
        }}
      />
    </div>
  )
}

export default App
