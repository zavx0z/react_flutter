import {useEffect, useRef, useState} from "react"

const useFlutter = () => {

}
const App = () => {
    const flutterTarget = useRef(null)
    const flutterState = useRef(null)
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (window._flutter) {
            window._flutter.loader.loadEntrypoint({
                entrypointUrl: "/flutter/main.dart.js",
                onEntrypointLoaded: async (engineInitializer) => {
                    let appRunner = await engineInitializer.initializeEngine({
                        hostElement: flutterTarget.current,
                        assetBase: "/flutter/",
                    })
                    await appRunner.runApp()
                },
            })
            flutterTarget.current.addEventListener("flutter-initialized", (event) => {
                onFlutterAppLoaded(event)
            })
            console.log(flutterTarget)
        }
    }, [window._flutter])
    const onFlutterAppLoaded = (event) => {
        flutterState.current = event.detail

        setCount(flutterState.current.getClicks())

        flutterState.current.onClicksChanged(() => setCount(flutterState.current.getClicks()))
        flutterState.current.onTextChanged(() => {
            console.log("onTextChanged()")
        })
    }
    return <div>

        <h1>{count}</h1>
        <button onClick={() => flutterState.current.setClicks(count + 1)}>+</button>
        <div
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                ref={flutterTarget}
                style={{
                    width: 444,
                    height: 444,
                    border: "1px solid black",
                }}
                id="App"
            />

        </div>
    </div>
}

export default App
