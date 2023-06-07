import 'package:flutter/material.dart';
import 'pages/counter.dart';
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
  late final AppStateManager _state;

  @override
  void dispose() {
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _state = AppStateManager( counter: _counter );
    final export = createDartExport(_state);

    // Выпустите это через корневой объект приложения Flutter :)
    broadcastAppEvent('flutter-initialized', export);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Приложение в приложении',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      routes: {
        '/': (context) => CounterDemo(counter: _counter),
      },
    );
  }
}
