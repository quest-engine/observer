
/*global Observer, beforeEach, afterEach */

describe("Observer", function () {
  it("should be declared", function () {
    expect(Observer).to.exist();
  });

  describe("#make", function () {
    it("should register attributes and methods", function () {
      var obj = {};

      Observer.make(obj);

      expect(obj.__callbacks).to.be.an('object');

      expect(obj.on).to.be.a('function');
      expect(obj.emit).to.be.a('function');
      expect(obj.clear).to.be.a('function');
    });

    it("should not override property", function () {
      var exception = false, obj = {
        on: 'value'
      };

      try {
        Observer.make(obj);
      } catch (e) {
        exception = true;
      }

      expect(exception).to.equal(true);
    });

    it("should override property if forced", function () {
      var obj = {
        on: 'value'
      };

      Observer.make(obj, true);
    });
  });

  describe("#events", function () {
    var obj;

    beforeEach(function () {
      obj = {};
      Observer.make(obj);
    });

    it("should register an event", function (done) {
      obj.on("event", done);

      obj.emit("event");
    });

    it("should call 2 types of events", function (done) {
      obj.on("event1", done);

      obj.on("event2", function () {
        obj.emit("event1");
      });

      obj.emit("event2");
    });

    it("should call multiple events of the same type", function (done) {
      var count = 0, callback = function () {
        count += 1;

        if (count === 3) {
          done();
        }
      };

      obj.on("event", callback);
      obj.on("event", callback);
      obj.on("event", callback);

      obj.emit("event");
    });

    it("should emit an event with a parameter", function (done) {
      obj.on("event", function (a) {
        expect(a).to.exist();
        expect(a).to.be.equal("hello");

        done();
      });

      obj.emit("event", "hello");
    });

    it("should emit an event with multiple parameters", function (done) {
      obj.on("event", function (a, b) {
        expect(a).to.exist();
        expect(a).to.be.equal("hello");

        expect(b).to.exist();
        expect(b).to.be.equal("world");

        done();
      });

      obj.emit("event", "hello", "world");
    });

    it("should emit an event with multiple types", function (done) {
      obj.on("event", function (num, str, object) {
        expect(num).to.be.a("number");
        expect(str).to.be.a("string");
        expect(object).to.be.an("object");

        done();
      });

      obj.emit("event", 123, "hello", {});
    });
  });

  describe("#clear", function () {
    var obj;

    beforeEach(function () {
      obj = {};
      Observer.make(obj);
    });

    it("should call the callback once", function (done) {
      var called = false;

      var ptr = obj.on("event", function () {

        if (called) {
          throw Error("callback should not be called");
        }

        called = true;

        obj.clear(ptr);

        obj.emit("event");

        done();
      });

      obj.emit("event");
    });

    it("should call other callbacks", function (done) {
      var count = 0;

      obj.on("event", function () {
        count += 1;

        if (count === 2) {
          done();
        }
      });

      var ptr = obj.on("event", function () {
        obj.clear(ptr);
      });

      obj.emit("event");
      obj.emit("event");
    });

  });
});