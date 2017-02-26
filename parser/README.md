# BlocksParser
Скрипт проходит по всему указанному dom дереву, и добавляет блочным элементам contenteditable для их редактирования.

[Demo page](http://demo.io/)

# Использование
1. Установить стиль и скрипт перед `</body>`
```
<link rel="stylesheet" href="blocks-parser.min.css">
<script src="BlocksParser.js"></script>
```
2. Запуск парсинга:
```
var myBlock = new BlocksParser('.blog');
```
где `.blog` - селектор с контентом

3. Получение html:
```
myBlock.get();
```

# API

#### Свойства
* `SELECTOR` - Узел селектора (напр.: `myBlock.SELECTOR = '.newsel';`)

#### Методы
* `get` - Получение готового HTML кода
* `init` - Запускает парсинг кода (Внимание! - этот метод используется в момент создания конструктора, повторное его использования возможно только после использования метода `update` )
* `update` - замена всех contenteditable на обычный html, редактирование будет запрещено.

# Change Log

#### v 0.1
* удаление лишнего
* add "ignore" tag
* удалить дерево

#### Released

# TODO
* restore method - вернуть код
* ...
