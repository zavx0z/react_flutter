import 'package:flutter/foundation.dart';
import 'package:js/js.dart';

/// Это бит состояния, который может видеть JS.
/// Он содержит геттеры/сеттеры/операции и механизм для
/// подписываемся на уведомления об изменениях от входящего [notifier].
@JSExport()
class AppStateManager {
  // Создает DemoAppStateManager, обертывающий ValueNotifier.
  AppStateManager({ required ValueNotifier<int> counter }) : _counter = counter;

  final ValueNotifier<int> _counter;

  // _counter
  int getClicks() {
    return _counter.value;
  }

  void setClicks(int value) {
    _counter.value = value;
  }

  void incrementClicks() {
    _counter.value++;
  }

  void decrementClicks() {
    _counter.value--;
  }

  // Позволяет клиентам подписываться на изменения обернутого значения.
  void onClicksChanged(VoidCallback f) {
    _counter.addListener(f);
  }
}