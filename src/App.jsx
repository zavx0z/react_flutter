import {useRef, useState} from "react"
import useFlutter from "./hooks/useFlutter"

const App = ({entrypointUrl, assetBase}) => {
    const flutterTarget = useRef(null)
    const flutterState = useRef(null)
    const [count, setCount] = useState(0)
    useFlutter({
        entrypointUrl: entrypointUrl,
        onEntrypointLoaded: async (engineInitializer) => {
            let appRunner = await engineInitializer.initializeEngine({
                hostElement: flutterTarget.current,
                assetBase: assetBase,
            })
            await appRunner.runApp()
        },
        baseUri: '/',
    })
    // useEffect(() => {
    //     if (window._flutter) {
    //         flutterTarget.current.addEventListener("flutter-initialized", (event) => {
    //             onFlutterAppLoaded(event)
    //         })
    //         console.log(flutterTarget)
    //     }
    // }, [assetBase, entrypointUrl])
    const onFlutterAppLoaded = (event) => {
        flutterState.current = event.detail
        setCount(flutterState.current.getClicks())
        flutterState.current.onClicksChanged(() => setCount(flutterState.current.getClicks()))
    }
    return <div
        style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
        }}
    >
        <div>
            <h1>{count}</h1>
            <button onClick={() => flutterState.current.setClicks(count + 1)}>+</button>
        </div>
        <div
            ref={flutterTarget}
            style={{
                width: 444,
                height: 444,
                border: "1px solid black",
            }}
        />
    </div>
}

export default App
