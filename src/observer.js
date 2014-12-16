// observer.js, a simple simple to make your object evented
(function (global) {
  "use strict";

  // `window` in the browser or `global` on node
  var root = typeof window !== 'undefined' ? window : global;

  var Observer = {},
    Observable = {};

  // make a object observable
  Observer.make = function (o, unsafe) {
    var p;

    // check if we will override properties
    if (!unsafe) {
      for (p in Observable) {
        if (Observable.hasOwnProperty(p) && o.hasOwnProperty(p)) {
          throw Error("cannot override property");
        }
      }
    }

    // add required attributes and methods
    for (p in Observable) {
      if (Observable.hasOwnProperty(p)) {
        o[p] = Observable[p];
      }
    }

    o.__callbacks = {};
  };

  // listen for an event
  Observable.on = function (event, callback) {
    if (typeof callback !== 'function') {
      return;
    }

    if (!this.__callbacks[event]) {
      this.__callbacks[event] = [];
    }

    this.__callbacks[event].push(callback);

    return {
      event: event,
      callback: callback
    }
  };

  // emit an events. `arguments` is used for event parameters
  Observable.emit = function (event) {
    var callbacks = this.__callbacks[event] || [],
      args        = Array.prototype.slice.call(arguments);

    args.splice(0, 1);

    for (var i = 0; i < callbacks.length; i += 1) {
      callbacks[i].apply(null, args);
    }
  };

  // clear an event with the `ptr` returned by `obj.on`
  Observable.clear = function (ptr) {
    var callbacks = this.__callbacks[ptr.event];

    for (var i = 0; i < callbacks.length; i += 1) {
      if (callbacks[i] === ptr.callback) {
        callbacks.splice(i, 1);

        return;
      }
    }
  };

  // detect requirejs and define module if defined. Else check for commonjs
  // and define a module if defined. If not in requirejs or commonjs, add
  // "Observer" to the global object
  if (typeof window !== 'undefined' && typeof require === "function" &&
    typeof define === "function") {

    define([], function () {
      return Observer;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Observer;
    root.Observer = Observer;
  } else {
    root.Observer = Observer;
  }
})(this);