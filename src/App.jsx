import { useEffect, useState } from "react"
import useFlutter from "./hooks/useFlutter"

const App = ({ appDir, baseUri }) => {
  const [count, setCount] = useState(0)
  const { flutterTarget, flutterState } = useFlutter({ baseUri, appDir })
  useEffect(() => {
    if (flutterState) {
      setCount(flutterState.getClicks())
      flutterState.onClicksChanged(() => setCount(flutterState.getClicks()))
    }
  }, [flutterState])
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
        <button onClick={() => flutterState.setClicks(count + 1)}>+</button>
      </div>
      <div
        ref={flutterTarget}
        style={{
          ...{visibility: flutterState? "visible" : "hidden"},
          width: 444,
          height: 444,
          border: "1px solid black",
        }}
      />
    </div>
  )
}

export default App
