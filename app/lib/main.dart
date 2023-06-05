// ignore_for_file: avoid_web_libraries_in_flutter

import 'package:flutter/material.dart';

import 'pages/counter.dart';
import 'pages/dash.dart';
import 'pages/text.dart';

import 'src/js_interop.dart';
import 'package:url_strategy/url_strategy.dart';

void main() {
  setPathUrlStrategy();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final ValueNotifier<int> _counter = ValueNotifier<int>(0);
  final ValueNotifier<DemoScreen> _screen = ValueNotifier<DemoScreen>(DemoScreen.counter);
  late final AppStateManager _state;
  final ValueNotifier<String> _text = ValueNotifier<String>('');

  @override
  void dispose() {
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _state = AppStateManager(
      screen: _screen,
      counter: _counter,
      text: _text,
    );
    final export = createDartExport(_state);

    // Выпустите это через корневой объект приложения Flutter :)
    broadcastAppEvent('flutter-initialized', export);
  }

  Widget demoScreenRouter(DemoScreen which) {
    switch (which) {
      case DemoScreen.counter:
        return CounterDemo(counter: _counter);
      case DemoScreen.text:
        return TextFieldDemo(text: _text);
      case DemoScreen.dash:
        return DashDemo(text: _text);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Приложение в приложении',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: ValueListenableBuilder<DemoScreen>(
        valueListenable: _screen,
        builder: (context, value, child) => demoScreenRouter(value),
      ),
    );
  }
}
