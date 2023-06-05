import 'dart:js_interop';
import 'package:js/js.dart';
import 'package:js/js_util.dart' as js_util;

// Аннотация @JS указывает, что класс является оберткой для JavaScript-объекта с именем 'CustomEvent'.
// Аннотация @staticInterop указывает, что класс будет использоваться для взаимодействия с JavaScript-кодом.
@JS('CustomEvent')
@staticInterop
class DomCustomEvent {
  // Приватный конструктор класса, который будет использоваться для создания объекта DomCustomEvent.
  factory DomCustomEvent._(String type, [Object? options]) {
    if (options != null) {
      // Если переданы параметры, вызываем фабричный конструктор DomCustomEvent.withOptions.
      return DomCustomEvent.withOptions(type.toJS, js_util.jsify(options) as JSAny);
    }
    // Если параметры не переданы, вызываем фабричный конструктор DomCustomEvent.withType.
    return DomCustomEvent.withType(type.toJS);
  }

  // Фабричный конструктор для создания объекта DomCustomEvent с указанным типом и параметрами.
  external factory DomCustomEvent.withOptions(JSString type, JSAny options);

  // Фабричный конструктор для создания объекта DomCustomEvent с указанным типом.
  external factory DomCustomEvent.withType(JSString type);
}
// Функция, которая отправляет пользовательское событие на указанный целевой элемент (target)
// с указанным типом события (type) и данными (data).
dispatchCustomEvent(DomElement target, String type, Object data) {
  final DomCustomEvent event = DomCustomEvent._(type, <String, Object>{
    'bubbles': true,
    'composed': true,
    'detail': data,
  });
  target.dispatchEvent(event);
}

@JS()
@staticInterop
class DomEventTarget {}

extension DomEventTargetExtension on DomEventTarget {
  @JS('dispatchEvent')
  external JSBoolean _dispatchEvent(DomCustomEvent event);
  bool dispatchEvent(DomCustomEvent event) => _dispatchEvent(event).toDart;
}

@JS()
@staticInterop
class DomElement extends DomEventTarget {}

extension DomElementExtension on DomElement {
  @JS('querySelector')
  external DomElement? _querySelector(JSString selectors);
  DomElement? querySelector(String selectors) => _querySelector(selectors.toJS);
}

@JS()
@staticInterop
class DomDocument extends DomElement {}

@JS()
@staticInterop
external DomDocument get document;