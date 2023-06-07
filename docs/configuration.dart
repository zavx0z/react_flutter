/// API JavaScript, которую может использовать веб-приложение Flutter для настройки веб-движка.
///
/// Конфигурация передается из JavaScript в движок в рамках процесса инициализации,
/// с использованием метода JS FlutterEngineInitializer.initializeEngine
/// с необязательным объектом типа [JsFlutterConfiguration].
///
/// Эта библиотека также поддерживает устаревший метод настройки обычного объекта JavaScript,
/// установленного в качестве свойства flutterConfiguration объекта верхнего уровня window,
/// но этот подход сейчас устарел и будет предупреждать пользователей.
///
/// Использование обоих методов запрещено одновременно.
///
/// Пример:
///
/// _flutter.loader.loadEntrypoint({
/// // ...
/// onEntrypointLoaded: async function(engineInitializer) {
/// let appRunner = await engineInitializer.initializeEngine({
/// // Здесь находится JsFlutterConfiguration...
/// canvasKitBaseUrl: "https://example.com/my-custom-canvaskit/",
/// });
/// appRunner.runApp();
/// }
/// });
/// Параметры конфигурации, указанные через этот объект, переопределяют те, которые указаны
/// с использованием соответствующих переменных окружения. Например, если источник
/// конфигурации canvasKitBaseUrl и переменные окружения FLUTTER_WEB_CANVASKIT_URL
/// предоставлены одновременно, будет использована запись canvasKitBaseUrl.

@JS()
library configuration;

import 'dart:js_interop';

import 'package:meta/meta.dart';
import 'canvaskit/renderer.dart';
import 'dom.dart';

/// Конфигурация веб-движка для текущего приложения.
FlutterConfiguration get configuration =>
    _configuration ??= FlutterConfiguration.legacy(_jsConfiguration);
FlutterConfiguration? _configuration;
/// Устанавливает заданную конфигурацию в качестве текущей.
///
/// Это должно быть вызвано до инициализации движка. Если вызвать его после
/// инициализации движка, некоторые свойства могут не вступить в силу, потому
/// что они потребляются во время инициализации.
@visibleForTesting
void debugSetConfiguration(FlutterConfiguration configuration) {
  _configuration = configuration;
}

/// Предоставляет свойства конфигурации веб-движка.
class FlutterConfiguration {
  /// Создает неинициализированный объект конфигурации.
  @visibleForTesting
  FlutterConfiguration();
/// Устанавливает значение для [_configuration].
///
/// Этот метод вызывается процессом инициализации движка через метод [initEngineServices].
///
/// Если объект _configuration был установлен на не-null значение через конструктор [FlutterConfiguration.legacy],
/// данный метод генерирует AssertionError.
void setUserConfiguration(JsFlutterConfiguration? configuration) {
if (configuration != null) {
assert(!_usedLegacyConfigStyle,
'Используйте engineInitializer.initializeEngine(config) только. '
'Одновременное использование (устаревшего) window.flutterConfiguration и initializeEngine '
'конфигурации не поддерживается.');
assert(_requestedRendererType == null || configuration.renderer == null,
'Используйте engineInitializer.initializeEngine(config) только. '
'Одновременное использование (устаревшего) window.flutterWebRenderer и initializeEngine '
'конфигурации не поддерживается.');
_configuration = configuration;
}
}

// Параметры константного времени выполнения.
//
// Эти свойства влияют на дерево сжатия кода и, следовательно, не могут быть заданы во время выполнения.
// Для эффективного удаления мертвого кода они должны быть статическими константами для компилятора.

/// Автоматическое определение используемого рендерингового бэкэнда.
///
/// Если использовать опцию инструментов Flutter "--web-render=auto" или не указывать ее,
/// значение будет true. В противном случае, оно будет false.
static const bool flutterWebAutoDetect =
bool.fromEnvironment('FLUTTER_WEB_AUTO_DETECT', defaultValue: true);

static const bool flutterWebUseSkwasm =
bool.fromEnvironment('FLUTTER_WEB_USE_SKWASM');

/// Включает рендеринговый бэкэнд на основе Skia.
///
/// Если использовать опцию инструментов Flutter "--web-render=canvaskit",
/// значение будет true.
///
/// Если использовать опцию инструментов Flutter "--web-render=html",
/// значение будет false.
static const bool useSkia =
bool.fromEnvironment('FLUTTER_WEB_USE_SKIA');

// Параметры времени выполнения.
//
// Эти параметры могут быть заданы как переменные среды, так и во время выполнения.
// Значения, заданные во время выполнения, имеют больший приоритет по сравнению с переменными среды.
/// Абсолютный базовый URL расположения каталога assets приложения.
///
/// Это значение полезно, когда ресурсы Flutter веб-приложения развертываются на отдельном
/// домене (или подкаталоге) от того, где обслуживается index.html, например:
///
/// * Приложение: https://www.my-app.com/
/// * Ресурсы Flutter: https://cdn.example.com/my-app/build-hash/assets/
///
/// Значение assetBase будет установлено следующим образом:
///
/// * 'https://cdn.example.com/my-app/build-hash/'
///
/// Также это полезно в случае, если Flutter веб-приложение встроено
/// в другое веб-приложение таким образом, что тег <base> в index.html
/// не может быть установлен (потому что это нарушило бы хост-приложение), например:
///
/// * Приложение: https://www.my-app.com/
/// * Ресурсы Flutter: https://www.my-app.com/static/companion/flutter/assets/
///
/// Значение assetBase будет установлено следующим образом:
///
/// * '/static/companion/flutter/'
///
/// Не путайте это значение конфигурации со значением [canvasKitBaseUrl].
String? get assetBase => _configuration?.assetBase;

/// Базовый URL для загрузки скрипта CanvasKit и связанного
/// wasm-модуля.
///
/// Ожидаемая структура каталога, вложенного под этим URL, выглядит следующим образом:
///
/// /canvaskit.js - сборка привязок API CanvasKit JS
/// /canvaskit.wasm - сборка модуля CanvasKit WASM
///
/// Базовый URL можно изменить, используя переменную окружения FLUTTER_WEB_CANVASKIT_URL
/// или с помощью API конфигурации для JavaScript.
///
/// При указании с использованием переменной окружения задайте ее в инструменте Flutter
/// с помощью опции --dart-define. Значение должно заканчиваться символом /.
///
/// Пример:
///
/// /// flutter run \ /// -d chrome \ /// --web-renderer=canvaskit \ /// --dart-define=FLUTTER_WEB_CANVASKIT_URL=https://example.com/custom-canvaskit-build/ ///
String get canvasKitBaseUrl => _configuration?.canvasKitBaseUrl ?? _defaultCanvasKitBaseUrl;
static const String _defaultCanvasKitBaseUrl = String.fromEnvironment(
'FLUTTER_WEB_CANVASKIT_URL',
defaultValue: 'canvaskit/',
);

/// Вариант CanvasKit, который следует загрузить.
///
/// Доступные значения:
/// /// * auto - значение по умолчанию. Движок автоматически определит наилучший вариант на основе браузера.
///
/// * full - полная версия CanvasKit, которую можно использовать в любом браузере.
///
/// * chromium - легкая версия CanvasKit, которую можно использовать в браузерах на основе Chromium.
CanvasKitVariant get canvasKitVariant {
final String variant = _configuration?.canvasKitVariant ?? 'auto';
return CanvasKitVariant.values.byName(variant);
}

/// Если установлено значение true, принудительно используется рендеринг только на процессоре в CanvasKit (т.е. движок не будет использовать WebGL).
///
/// Это преимущественно используется для тестирования или для приложений, которые хотят гарантировать работу на устройствах, которые не поддерживают WebGL.
bool get canvasKitForceCpuOnly => _configuration?.canvasKitForceCpuOnly ?? _defaultCanvasKitForceCpuOnly;
static const bool _defaultCanvasKitForceCpuOnly = bool.fromEnvironment(
'FLUTTER_WEB_CANVASKIT_FORCE_CPU_ONLY',
);

/// Максимальное количество наложенных поверхностей, которые будет использовать рендерер CanvasKit.
///
/// Наложенные поверхности - это дополнительные элементы WebGL <canvas>, используемые для рисования поверх платформенных представлений. Слишком много платформенных представлений может привести к нехватке ресурсов браузера (память, ЦП, ГП) для эффективной обработки контента. Поэтому количество наложенных поверхностей ограничено.
///
/// Это значение можно указать с помощью переменной окружения FLUTTER_WEB_MAXIMUM_SURFACES или с помощью конфигурации времени выполнения.
int get canvasKitMaximumSurfaces =>
_configuration?.canvasKitMaximumSurfaces?.toInt() ?? _defaultCanvasKitMaximumSurfaces;
static const int _defaultCanvasKitMaximumSurfaces = int.fromEnvironment(
'FLUTTER_WEB_MAXIMUM_SURFACES',
defaultValue: 8,
);

/// Установите этот флаг в значение true, чтобы заставить движок визуализировать семантическое дерево на экране для отладки.
///
/// Это работает только в режимах профилирования и релиза. В отладочном режиме не поддерживается передача констант времени компиляции.
///
/// Пример:
///
/// /// flutter run -d chrome --profile --dart-define=FLUTTER_WEB_DEBUG_SHOW_SEMANTICS=true ///
bool get debugShowSemanticsNodes => _configuration?.debugShowSemanticsNodes ?? _defaultDebugShowSemanticsNodes;
static const bool _defaultDebugShowSemantics
/// Возвращает значение [debugShowSemanticsNodes], которое определяет, должно ли отображаться дерево семантики на экране для отладки.
///
/// Это работает только в режимах профиля и релиза. Режим отладки не поддерживает передачу констант времени компиляции.
///
/// Пример:
///
/// ```
/// flutter run -d chrome --profile --dart-define=FLUTTER_WEB_DEBUG_SHOW_SEMANTICS=true
/// ```
bool get debugShowSemanticsNodes => _configuration?.debugShowSemanticsNodes ?? _defaultDebugShowSemanticsNodes;
static const bool _defaultDebugShowSemanticsNodes = bool.fromEnvironment(
  'FLUTTER_WEB_DEBUG_SHOW_SEMANTICS',
);

/// Возвращает элемент [hostElement], в котором должно отображаться приложение Flutter, или `null`, если пользователь не указал ничего.
DomElement? get hostElement => _configuration?.hostElement;

/// Возвращает [requestedRendererType], который должен использоваться с текущим приложением Flutter, обычно 'canvaskit' или 'auto'.
///
/// Это значение может быть получено из JS-конфигурации, а также из определенного значения в JS: `window.flutterWebRenderer`.
///
/// Это используется классом Renderer для принятия решения о том, как инициализировать движок.
String? get requestedRendererType => _configuration?.renderer ?? _requestedRendererType;

/// Определяет, должны ли использоваться цветные эмодзи или нет.
///
/// Шрифт, используемый для отображения цветных эмодзи, занимает много места (~24 МБ). Эта конфигурация дает разработчикам возможность решить для своего приложения.
bool get useColorEmoji => _configuration?.useColorEmoji ?? false;