import React, { useEffect } from "react";

const createScriptTag = (url) => {
  const scriptTag = document.createElement("script");
  scriptTag.type = "application/javascript";
  scriptTag.src = url;
  document.body.append(scriptTag);
};

const useFlutter = ({ entrypointUrl, onEntrypointLoaded, baseUri }) => {
  useEffect(() => {
    let baseElement = document.querySelector("base")
    if (!baseElement) {
      baseElement = document.createElement("base");
      document.head.appendChild(baseElement);
    }
    baseElement.href = baseUri;

    window._flutter = {
      loader: {
        didCreateEngineInitializer: (engine) => onEntrypointLoaded(engine),
      },
    };
    const scriptTag = createScriptTag(entrypointUrl);
  }, [baseUri, entrypointUrl, onEntrypointLoaded]);

  return null;
};

export default useFlutter;
