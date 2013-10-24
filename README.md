binary-io.jsx
===========================================

Synopsis
---------------

Data serialize/deserialize utility for JS/JSX/AMD/CommonJS

Motivation
---------------

This is a part of [Oktavia](http://oktavia.info). This code is created for serialize/desrialize search engine dictionary.
Oktavia is a client side search engine. To realize that, this module packs data into string and compress a little.

From 0.2, it became compatible with [oktavia.py](https://github.com/shibukawa/oktavia.py)'s `binaryio.py`.

Code Example
---------------

### Use from JSX

```js
import "binary-io.jsx";
import "js/nodejs.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // reading
        var data = node.fs.readFileSync("searchdata.bin", "utf16le");
        var input = new BinaryInput(data);
        var dataSize = input.load32bitNumber();
        var keywords = input.loadStringList();

        // writing
        var output = new BinaryOutput();
        output.dump32bitNumber(dataSize);
        output.dumpStringList(names);
        node.fs.writeFileSync("outputdata.bin", output.result(), 'utf16le');
    }
}
```

### Use from node.js

```js
var BinaryInput = require('binary-io.common.js').BinaryInput;
var BinaryOutput = require('binary-io.common.js').BinaryOutput;

var input = new BinaryInput(fs.readFileSync(process.argv[2], 'utf16le'));
var scores = input.load32bitNumberList();
```

### Use from require.js

```js
// use binary-io.amd.js
define(['binary-io.amd'], function (binary-io.jsx) {

    $.get('http://example.com/database', function (data) {
        var input = new BinaryInput(window.atob(data));
        $('#name').text(input.loadString());
    });

});
```

### Use via standard JSX function

```html
<script src="binary-io.js}}" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var BinaryOutput = JSX.require("src/binary-io.js").BinaryOutput;
    var output = new BinaryOutput();
    output.dump16bitNumber($('#selectedNumber').value());
    output.dumpStringList($('#nameListTextArea').value().split('\n'));
    $.post('http://example.com/postData/', output.result());
});
</script>
```

### Use via global variables

```html
<script src="binary-io.global.js}}" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var obj = new BinaryOutput();
    ...
});
</script>
```

Installation
---------------

```sh
$ npm install binary-io.jsx
```

API Reference
------------------

It provides the following methods. This module doesn't store type information.
You should call BinaryInput's method in same order of BinaryOutput to keep data.

### BinaryInput(data : string)

    Constructor. `data` should be a serialized data by `BinaryOutput`.

#### load32bitNumber() : number

    Read 4 bytes and return value as number.

#### load16bitNumber() : int

    Read 2 bytes and return value as int.

#### loadString() : string

    Read data return value as string.

#### loadStringList() : string[]

    Read data return value as list of string.

#### loadStringListMap() : Map.<string[]>

    Read data return value as map of list of string.

#### load32bitNumberList() : number[]

    Read data and return as list of number.

### BinaryOutput

    Constructor. No option accept.

#### dump32bitNumber(data : number) : void

    Append 4 bytes data to result string.

#### dump16bitNumber(data : int) : void

    Append 2 bytes data to result string.

#### dumpString(data : string) : void

    Append string to result string. If all characters uses only latin-1 characters,
    It packs 2 characters into 1 character.

#### dumpStringList(data : string[]) : void

    Append string list to result string. It uses a same data compression as `dumpString`.

#### dumpStringListMap(data : Map.<string[]>) : void

    Append map of string list to result string. It uses a same data compression as `dumpString`.

#### dump32bitNumberList(data : number[]) : void

    Append list of numbers to result string. It uses simple RLE like data compression.

#### result() : string

    Return resulting string.

Development
-------------

## JSX

Don't afraid [JSX](http://jsx.github.io)! If you have an experience of JavaScript, you can learn JSX
quickly.

* Static type system and unified class syntax.
* All variables and methods belong to class.
* JSX includes optimizer. You don't have to write tricky unreadalbe code for speed.
* You can use almost all JavaScript API as you know. Some functions become static class functions. See [reference](http://jsx.github.io/doc/stdlibref.html).

## Setup

To create development environment, call following command:

```sh
$ npm install
```

## Repository

* Repository: git@github.com:shibukawa/binary-io.jsx.git
* Issues: https://github.com/shibukawa/binary-io.jsx/issues

## Run Test

```sh
$ grunt test
```

## Build

```sh
$ grunt build
```

## Generate API reference

```sh
$ grunt doc
```

Author
---------

* shibukawa / yoshiki@shibu.jp

License
------------

MIT

Complete license is written in `LICENSE.md`.
