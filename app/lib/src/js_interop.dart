// Предоставляет полезные функции для взаимодействия с JS из нашего приложения Flutter.
library example_js_interop;

export 'js_interop/counter_state_manager.dart';
export 'js_interop/helper.dart' show broadcastAppEvent;
export 'package:js/js_util.dart' show createDartExport;