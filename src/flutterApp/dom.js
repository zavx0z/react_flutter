export const createScriptTag = (url) => {
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
export const deleteScriptTag = (tag) => {
  const scriptTags = document.querySelectorAll(`script[${tag}]`)
  scriptTags.forEach((scriptTag) => {
    scriptTag.remove()
  })
}
export const setBaseUri = (baseUri) => {
  let baseElement = document.querySelector("base")
  if (!baseElement) {
    baseElement = document.createElement("base")
    document.head.appendChild(baseElement)
  }
  baseElement.href = baseUri
}
