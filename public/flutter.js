if (!_flutter) {
    var _flutter = {}
}
_flutter.loader = null;

(function () {
    "use strict"
    const baseUri = ensureTrailingSlash(getBaseURI())

    function getBaseURI() {
        const base = document.querySelector("base")
        return (base && base.getAttribute("href")) || ""
    }

    function ensureTrailingSlash(uri) {
        if (uri == "") {
            return uri
        }
        return uri.endsWith("/") ? uri : `${uri}/`
    }

    class FlutterTrustedTypesPolicy {
        /**
         * Обрабатывает создание политики TrustedTypes policy, которая проверяет URL-адреса на основе (необязательного) входящего массива регулярных выражений.
         */
        constructor(validPatterns, policyName = "flutter-js") {
            const patterns = validPatterns || [/.js$/]
            console.log(window.trustedTypes)
            if (window.trustedTypes) {
                this.policy = trustedTypes.createPolicy(policyName, {
                    createScriptURL: function (url) {
                        const parsed = new URL(url, window.location)
                        const file = parsed.pathname.split("/").pop()
                        const matches = patterns.some((pattern) => pattern.test(file))
                        if (matches) {
                            return parsed.toString()
                        }
                        console.error("URL отклонен политикой TrustedTypes", policyName, ":", url, "(загрузка предотвращена)")
                    }
                })
            }
        }
    }

    /** Обрабатывает внедрение основной точки входа Flutter для веба (main.dart.js)
     * уведомляет пользователя о готовности Flutter через didCreateEngineInitializer. */
    class FlutterEntrypointLoader {
        /** Creates a FlutterEntrypointLoader. */
        constructor() {
            // Watchdog для предотвращения множественного внедрения основной точки входа.
            this._scriptLoaded = false
        }

        /**
         * Внедряет политику TrustedTypes (или undefined, если функциональность не поддерживается).
         * @param {TrustedTypesPolicy | undefined} policy
         */
        setTrustedTypesPolicy(policy) {
            this._ttPolicy = policy
        }

        /**
         Загружает основную точку входа Flutter, указанную в entrypointUrl,
         и вызывает пользовательский колбэк onEntrypointLoaded с объектом EngineInitializer, когда загрузка завершена.
         @param {*} options
         @returns {Promise | undefined}, который в конечном итоге разрешится объектом EngineInitializer
         или будет отклонен с ошибкой, вызванной загрузчиком.
         Возвращает undefined, когда в options указан колбэк onEntrypointLoaded.
         */
        async loadEntrypoint(options) {
            const {entrypointUrl = `${baseUri}main.dart.js`, onEntrypointLoaded} = options || {}
            return this._loadEntrypoint(entrypointUrl, onEntrypointLoaded)
        }

        /**
         * Разрешает Promise, созданный методом loadEntrypoint,
         * вызывает функцию onEntrypointLoaded, предоставленную пользователем (если требуется).
         * Вызывается Flutter через метод _flutter.loader.didCreateEngineInitializer,
         * который привязан к правильному экземпляру FlutterEntrypointLoader объектом FlutterLoader.
         * @param {Function} engineInitializer @see https://github.com/flutter/engine/blob/main/lib/web_ui/lib/src/engine/js_interop/js_loader.dart#L42
         */
        didCreateEngineInitializer(engineInitializer) {
            if (typeof this._didCreateEngineInitializerResolve === "function") {
                this._didCreateEngineInitializerResolve(engineInitializer)
                // Удаляем разрешитель после первого раза, чтобы Flutter Web мог выполнить горячую перезагрузку.
                this._didCreateEngineInitializerResolve = null
                //  Возвращаем инициализацию движка к автоматическому режиму при горячей перезагрузке.
                delete _flutter.loader.didCreateEngineInitializer
            }
            if (typeof this._onEntrypointLoaded === "function") {
                this._onEntrypointLoaded(engineInitializer)
            }
        }

        /**
         Внедряет тег скрипта в DOM и настраивает загрузчик для обработки уведомлений о "загрузке точки входа", полученных от Flutter веб.
         @param {string} entrypointUrl URL скрипта, который инициализирует Flutter.
         @param {Function} onEntrypointLoaded колбэк, который будет вызван, когда Flutter веб уведомит об загрузке точки входа.
         */
        _loadEntrypoint(entrypointUrl, onEntrypointLoaded) {
            if (!this._scriptLoaded) {
                this._scriptLoaded = true
                const scriptTag = this._createScriptTag(entrypointUrl)
                // Внедряет тег скрипта
                // Flutter вызовет didCreateEngineInitializer, когда он будет готов.
                this._onEntrypointLoaded = onEntrypointLoaded
                document.body.append(scriptTag)
            }
        }

        /**
         * Creates a script tag for the given URL.
         * @param {string} url
         * @returns {HTMLScriptElement}
         */
        _createScriptTag(url) {
            const scriptTag = document.createElement("script")
            scriptTag.type = "application/javascript"
            // Apply TrustedTypes validation, if available.
            let trustedUrl = url
            if (this._ttPolicy != null) {
                trustedUrl = this._ttPolicy.createScriptURL(url)
            }
            scriptTag.src = trustedUrl
            return scriptTag
        }
    }

    /**
     Публичный интерфейс _flutter.loader. Предоставляет два метода:
     loadEntrypoint (который координирует процедуру загрузки Flutter для веба по умолчанию)
     didCreateEngineInitializer (который вызывается Flutter для уведомления, что его Engine готов к инициализации)
     */
    class FlutterLoader {
        /**
         * Инициализирует веб-приложение Flutter.
         * @param {*} options
         * @returns {Promise?} (Устаревший) Promise, который в конечном итоге разрешается
         * с EngineInitializer или отклоняется с ошибкой, вызванной загрузчиком.
         * Или Null, если пользователь предоставил функцию onEntrypointLoaded
         * в качестве параметра.
         */
        async loadEntrypoint(options) {
            const {serviceWorker, ...entrypoint} = options || {}
            // Trusted Types политика, которая будет использоваться загрузчиком.
            const flutterTT = new FlutterTrustedTypesPolicy()
            const entrypointLoader = new FlutterEntrypointLoader()
            entrypointLoader.setTrustedTypesPolicy(flutterTT.policy)
            // Устанавливаем слушатель didCreateEngineInitializer там, где его ожидает Flutter web.
            this.didCreateEngineInitializer = entrypointLoader.didCreateEngineInitializer.bind(entrypointLoader)
            return entrypointLoader.loadEntrypoint(entrypoint)
        }
    }

    _flutter.loader = new FlutterLoader()
})()
