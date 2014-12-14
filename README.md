Observer
========

A simple implementation of the Observer pattern with test coverage.

Works in browser and node environments, and supports CommonJS and RequireJS (The `Observer` object is therefore exposed as a module).

## Why yet another implementation

 * the other implmentations are not cross-environment
 * mostly use subscribe/publish paradigm, this one uses named events which reduce boilerplate code
 * test coverage

## Installation

With npm :

```bash
npm install git+https://github.com/quest-engine/observer.git
```

With bower :

```bash
bower install https://github.com/quest-engine/observer.git
```

Unfortunatly, most of the module names with "observer" are already taken, thats why I havn't published it yet.

## Usage

You can make every object observable by using `Observer.make` :

```javascript
var obj = {};

Observer.make(obj);

obj.on("event", function () {
	// do something
});

obj.on("otherEvent", function () {
	// this will not be called
});

// fire the event
obj.emit("event");
```

Event listeners can stack :

```javascript
var count = 0;

function increment() {
	count++;
}

obj.on("increment", increment);
obj.on("increment", increment);
obj.on("increment", increment);

obj.emit("event");

// prints "3"
console.log(count);
```

`emit` support parameters :

```javascript
obj.on("message", function (name, age, data) {
	// prints "Jack (20): hello world!"
	console.log(name + "(" + age + ") : " + data.message);
});

obj.emit("message", "Jack", 20, {
	message: "hello world!"
});
```

You can clear your event listeners with :

```javascript
var ptr = obj.on("event", callback);

// later
obj.clear(ptr);
```