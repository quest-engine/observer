// observer.js, a simple simple to make your object evented
(function (global) {
  "use strict";

  // `window` in the browser or `global` on node
  var root = typeof window !== 'undefined' ? window : global;

  var Observer = {},
    Observable = {};

  // some shortcuts to call listeners
  function callListeners(listeners) {
    var cachedLength = listeners.length;

    for (var i = 0; i < cachedLength; i += 1) {
      listeners[i]();

      // handle calls to dispose()
      if (listeners.length < cachedLength) {
        i -= 1;
        cachedLength = listeners.length;
      }
    }
  }

  function callListenersWith1Args(listeners, arg0) {
    var cachedLength = listeners.length;

    for (var i = 0; i < cachedLength; i += 1) {
      listeners[i](arg0);

      if (listeners.length < cachedLength) {
        i -= 1;
        cachedLength = listeners.length;
      }
    }
  }

  function callListenersWith2Args(listeners, arg0, arg1) {
    var cachedLength = listeners.length;

    for (var i = 0; i < cachedLength; i += 1) {
      listeners[i](arg0, arg1);

      if (listeners.length < cachedLength) {
        i -= 1;
        cachedLength = listeners.length;
      }
    }
  }

  function callListenersWith3Args(listeners, arg0, arg1, arg2) {
    var cachedLength = listeners.length;

    for (var i = 0; i < cachedLength; i += 1) {
      listeners[i](arg0, arg1, arg2);

      if (listeners.length < cachedLength) {
        i -= 1;
        cachedLength = listeners.length;
      }
    }
  }

  function callListenersWithFreeArgs(listeners, args) {
    var cachedLength = listeners.length;

    for (var i = 0; i < cachedLength; i += 1) {
      listeners[i].apply(null, args);

      if (listeners.length < cachedLength) {
        i -= 1;
        cachedLength = listeners.length;
      }
    }
  }

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

    o.__events = {};
  };

  // listen for an event
  Observable.on = function (event, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    if (!this.__events[event]) {
      this.__events[event] = [];
    }

    this.__events[event].push(listener);

    var self = this;

    return {
      dispose: function () {
        self.clear(event, listener);
      }
    };
  };

  // listen for an event, called only once
  Observable.once = function (event, listener) {
    var self = this, ptr;

    ptr = this.on(event, function () {
      // no optimization here sincee it should be called once
      // todo: optimise the way of passing arguments
      var args = Array.prototype.slice.call(arguments);

      ptr.dispose();

      listener.apply(null, args);
    });
  };

  // emit an events
  Observable.emit = function (event, arg0, arg1, arg2) {
    var listeners = this.__events[event];

    if (!listeners || !listeners.length) {
      return;
    }

    // if there is 3 or less aurgments, do not use apply to preserve 
    // performances
    if (arguments.length < 5) {
      switch (arguments.length) {
        case 1: callListeners(listeners); break;
        case 2: 
          callListenersWith1Args(listeners, arg0);
          break;
        case 3: 
          callListenersWith2Args(listeners, arg0, arg1);
          break;
        case 4: 
          callListenersWith3Args(listeners, arg0, arg1, arg2);
          break;
      }
    } else {
      // Optimization-efficient way to copy args
      var args = new Array(arguments.length - 1);

      for (var i = 1; i < args.length; ++i) {
        args[i] = arguments[i];
      } 

      callListenersWithFreeArgs(listeners, args);
    }
  };

  // clear an event listener
  Observable.clear = function (event, listener) {
    var listeners = this.__events[event];

    if (!listeners || !listeners.length) {
      return;
    }

    var index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
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