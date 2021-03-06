Observer
========

A simple implementation of the Observer pattern with test coverage.

Works in browser and node environments, supports AMD module definition and
RequireJS (The `Observer` object is therefore exposed as a module).

This module was created for my own usage but I decided to share it.

## Why yet another implementation

There is already plenty of implementations of such a module such as the
good [EventEmitter](https://github.com/Wolfy87/EventEmitter). The reasons
why I decided to do my own :

 * lightweight
 * can make every object observable
 * the other implementations are not cross-environment (browser and node,
   install through `npm` or `bower`)
 * most use subscribe/publish paradigm, this implementation uses named events
   which reduce boilerplate code
 * ready to use with [requirejs](requirejs.org)
 * fast
 * test coverage

## Installation

With npm :

```bash
npm install quest-observer
```

With bower :

```bash
bower install quest-observer
```

## Usage

You can make every object observable by using `Observer.make` :

```javascript
// we can also use new function () {}
var o = {};

// you can now listen for events on object o !
Observable.make(o);

// this will print "world!"
o.on("hello", function () {
  console.log("world!");
});

// this will not be called
o.on("bonjour", function () {
  console.log("le monde!");
});

// emit and event
o.emit("hello");
```

Event handlers can stack :

```javascript
var count = 0;

// generic handler
function increment() {
	count++;
}

// oups I used Ctrl+V 3 times!
obj.on("increment", increment);
obj.on("increment", increment);
obj.on("increment", increment);

obj.emit("increment");

// prints "3"
console.log(count);
```

`emit` also support parameters :

```javascript
obj.on("message", function (name, age, data) {
    // prints "Jack (20): hello world!"
	console.log(name + "(" + age + ") : " + data.message);
});

obj.emit("message", "Jack", 20, {
	message: "hello world!"
});
```

You can clear your event listeners with `clear` :

```javascript
var ptr = obj.on("event", callback);

// clear by using the event name and listener reference
obj.clear("event", callback);

// clear using the dispose handler returned by on()
ptr.dispose();
```

You can also listen for an event only once:

```javascript
obj.once("complete", function () {
    // this will be called once regardless of number of "complete" events
});

obj.emit("complete");
obj.emit("complete");
```

## License

Copyright (c) 2015, Pierre BEAUJEU

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.