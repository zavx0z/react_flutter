import React, { useEffect } from "react";

const createScriptTag = (url) => {
  const scriptTag = document.createElement("script");
  scriptTag.type = "application/javascript";
  scriptTag.src = url;

  const regex = /\/([^/]+)\.js$/;
  const match = url.match(regex);
  const result = match[1].replace('.', '_')
  scriptTag.setAttribute(result, "");
  document.body.append(scriptTag);
  return result;
};

const deleteScriptTag = (tag) => {
    const scriptTags = document.querySelectorAll(`script[${tag}]`);
    scriptTags.forEach((scriptTag) => {
      scriptTag.remove();
    }); 
}

export const loader = (entrypointUrl, onEntrypointLoaded, baseUri) => {
    let baseElement = document.querySelector("base");
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

    const element = document.createElement("div")
}


const useFlutter = ({ entrypointUrl, onEntrypointLoaded, baseUri }) => {
  useEffect(() => {
    console.log(baseUri)
    let baseElement = document.querySelector("base");
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
    setTimeout(() => deleteScriptTag(scriptTag), 2000);
  }, [baseUri, entrypointUrl, onEntrypointLoaded]);

  return null;
};

export default useFlutter;
