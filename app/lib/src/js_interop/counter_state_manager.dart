import 'package:flutter/foundation.dart';
import 'package:js/js.dart';

/// This is the bit of state that JS is able to see.
///
/// It contains getters/setters/operations and a mechanism to
/// subscribe to change notifications from an incoming [notifier].
@JSExport()
class AppStateManager {
  // Creates a DemoAppStateManager wrapping a ValueNotifier.
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

  // Allows clients to subscribe to changes to the wrapped value.
  void onClicksChanged(VoidCallback f) {
    _counter.addListener(f);
  }
}