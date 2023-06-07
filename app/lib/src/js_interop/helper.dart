import 'dom.dart' as dom;

// Функция `broadcastAppEvent` используется для отправки пользовательских событий из Flutter в JavaScript-код
// которая позволяет обмениваться данными и уведомлениями между двумя средами.

// Функция `broadcastAppEvent` принимает имя события [name] и данные [data] в качестве аргументов и выполняет следующее:

// 1. Импортируется модуль `dom` из файла `dom.dart` и привязывается к псевдониму `dom`.

/// 2. Метод `querySelector` вызывается на объекте `dom.document` для поиска первого элемента, который имеет атрибут [flt-renderer]. 
/// Это позволяет найти корневой элемент Flutter-приложения. 
/// Результат сохраняется в переменной `root`.

// 3. Проверяется, что `root` не является `null` с помощью `assert`.
// Если `root` равен `null`, выбрасывается исключение с сообщением "Flutter root element cannot be found!".

// 4. Вызывается метод `dispatchCustomEvent` на объекте `dom`, передавая `root`, `name` и `data` в качестве аргументов.
// Это позволяет отправить настраиваемое событие с именем `name` и данными `data` на корневой элемент Flutter-приложения
void broadcastAppEvent(String name, Object data) {
  final dom.DomElement? root = dom.document.querySelector('[flt-renderer]');
  assert(root != null, 'Flutter root element cannot be found!');

  dom.dispatchCustomEvent(root!, name, data);
}