// Copyright 2012 The Obvious Corporation.

/*
 * Typ: Useful type functions.
 */


/*
 * Modules used
 */

"use strict";

var assert = require("assert");


/*
 * Variable definitions
 */

/** extended type name */
var ARRAY = "array";

/** type name */
var BOOLEAN = "boolean";

/** extended type name */
var BUFFER = "buffer";

/** extended type name */
var DATE = "date";

/** extended type name */
var ERROR = "error";

/** type name */
var FUNCTION = "function";

/** extended type name */
var INT = "int";

/** extended type name */
var MAP = "map";

/** extended type name */
var NULL = "null";

/** type name */
var NUMBER = "number";

/** type name */
var OBJECT = "object";

/** extended type name */
var REGEXP = "regexp";

/** type name */
var STRING = "string";

/** extended type name */
var UINT = "uint";

/** type name */
var UNDEFINED = "undefined";

/** the prototype of plain (map) objects */
var OBJECT_PROTOTYPE = Object.getPrototypeOf({});

/** the prototype of normal arrays */
var ARRAY_PROTOTYPE = Object.getPrototypeOf([]);

/** the prototype of normal functions */
var FUNCTION_PROTOTYPE = Object.getPrototypeOf(Object);

/** the prototype of date objects */
var DATE_PROTOTYPE = Date.prototype;

/** the base prototype of error objects */
var ERROR_PROTOTYPE = Error.prototype;

/** the prototype of regexp objects */
var REGEXP_PROTOTYPE = RegExp.prototype;

/** the function object `Object.hasOwnProperty` */
var HAS_OWN_PROPERTY_FUNC = Object.hasOwnProperty;

/** the base `Object.toString()` method */
var objectToString = Object.prototype.toString;


/*
 * Helper functions
 */

/**
 * Call the base `Object.toString()` method. This is used as part of
 * type determination to help avoid cases where (through ignorance or malice)
 * user-defined objects try to abuse the core underlying classes.
 *
 * The tactic here (that is, how this function is used) was learned
 * from the Node `util` module.
 */
function baseToString(value) {
  return objectToString.call(value);
}


function extendedTypeOf(value) {
  var type = typeof value;

  switch (type) {
    case BOOLEAN:
    case FUNCTION:
    case STRING:
    case UNDEFINED: {
      return type;
    }
    case NUMBER: {
      if (isInt(value)) {
        return (value > 0) ? UINT : INT;
      } else {
        return NUMBER;
      }
    }
    case OBJECT: {
      if (value === null) {
        return NULL;
      } else if (isArray(value)) {
        return ARRAY;
      } else if (isBuffer(value)) {
        return BUFFER;
      } else if (isDate(value)) {
        return DATE;
      } else if (isError(value)) {
        return ERROR;
      } else if (isRegExp(value)) {
        return REGEXP;
      } else if (isMap(value)) {
        return MAP;
      } else {
        return OBJECT;
      }
    }
  }
}

/**
 * Somewhat more helpful failure message.
 */
function failType(value, expectedTypeName) {
  var gotType = extendedTypeOf(value);
  var message = "Expected " + expectedTypeName + "; got " + gotType;

  switch (gotType) {
    case BOOLEAN:
    case DATE:
    case INT:
    case NUMBER:
    case REGEXP:
    case UINT: {
      message += " (" + value + ")";
      break;
    }
    case ERROR: {
      if (value.message) {
        message += " (" + value.message + ")";
      }
      break;
    }
    case FUNCTION: {
      if (value.name) {
        message += " (" + value.name + ")";
      }
      break;
    }
  }

  assert.fail(gotType, expectedTypeName, message, "!==");
}


/*
 * Exported bindings
 */

/**
 * Return whether or not the given object has the default object
 * prototype.
 */
function hasDefaultPrototype(obj) {
  return Object.getPrototypeOf(obj) === OBJECT_PROTOTYPE;
}

/**
 * Safe version of `obj.hasOwnProperty()`.
 */
function hasOwnProperty(obj, name) {
  return HAS_OWN_PROPERTY_FUNC.call(obj, name);
}

// For symmetry.
var isArray = Array.isArray;

function isBoolean(x) {
  return (x === true) || (x === false);
}

// For symmetry.
var isBuffer = Buffer.isBuffer;

function isDate(x) {
  return isObject(x) &&
    (Object.getPrototypeOf(x) === DATE_PROTOTYPE) &&
    (baseToString(x) === '[object Date]');
}

function isDefined(x) {
  // `(void 0)` is a particularly safe way to say `undefined`.
  return x !== (void 0);
}

function isUndefined(x) {
  return x === (void 0);
}

function isError(x) {
  return isObject(x) &&
    (baseToString(x) === '[object Error]') &&
    hasErrorProto(x);

  function hasErrorProto(obj) {
    while (obj && (obj !== OBJECT_PROTOTYPE)) {
      if (obj === ERROR_PROTOTYPE) {
        return true;
      }
      obj = Object.getPrototypeOf(obj);
    }
    return false;
  }
}

function isRegExp(x) {
  return isObject(x) &&
    (Object.getPrototypeOf(x) === REGEXP_PROTOTYPE) &&
    (baseToString(x) === '[object RegExp]');
}

function isString(x) {
  return (typeof x) === STRING;
}

/**
 * A "map" is an object whose prototype is the default object prototype
 * and which furthermore defines no enumerable dynamic properties.
 */
function isMap(x) {
  if (!isObject(x)) {
    return false;
  }

  if (Object.getPrototypeOf(x) !== OBJECT_PROTOTYPE) {
    return false;
  }

  var keys = Object.keys(x);
  for (var i = 0; i < keys.length; i++) {
    var props = Object.getOwnPropertyDescriptor(x, keys[i]);
    if (props.get || props.set) {
      return false;
    }
  }

  return true;
}

function isNull(x) {
  return (x === null);
}

function isNumber(x) {
  return (typeof x) === NUMBER;
}

function isObject(x) {
  var type = typeof x;
  return ((type === OBJECT) || (type === FUNCTION)) && (x !== null);
}

function isInt(x) {
  if (!isNumber(x) || (x !== Math.floor(x)) || !isFinite(x)) {
    return false;
  }

  if (x !== 0) {
    return true;
  }

  // Zero is special. We don't count "-0" as an int, but you can't
  // just test that with === because === doesn't distinguish positive
  // and negative zeroes. However, we can use it as a divisor to see
  // its effect.

  return (1/x) === Infinity;
}

function isUInt(x) {
  return isInt(x) && (x >= 0);
}

function isFunction(x) {
  return (typeof x) === FUNCTION;
}

function assertArray(x) {
  if (!isArray(x)) {
    failType(x, ARRAY);
  }
}

function assertBoolean(x) {
  if (!isBoolean(x)) {
    failType(x, BOOLEAN);
  }
}

function assertBuffer(x) {
  if (!isBuffer(x)) {
    failType(x, BUFFER);
  }
}

function assertDate(x) {
  if (!isDate(x)) {
    failType(x, DATE);
  }
}

function assertDefined(x) {
  if (!isDefined(x)) {
    assert.fail("undefined", "(anything else)",
          "Expected defined value", "!==");
  }
}

function assertUndefined(x) {
  if (!isUndefined(x)) {
    failType(x, UNDEFINED);
  }
}

function assertError(x) {
  if (!isError(x)) {
    failType(x, ERROR);
  }
}

function assertInt(x) {
  if (!isInt(x)) {
    failType(x, INT);
  }
}

function assertNull(x) {
  if (!isNull(x)) {
    failType(x, NULL);
  }
}

function assertNumber(x) {
  if (!isNumber(x)) {
    failType(x, NUMBER);
  }
}

function assertMap(x) {
  if (!isMap(x)) {
    failType(x, MAP);
  }
}

function assertObject(x) {
  if (!isObject(x)) {
    failType(x, OBJECT);
  }
}

function assertRegExp(x) {
  if (!isRegExp(x)) {
    failType(x, REGEXP);
  }
}

function assertString(x) {
  if (!isString(x)) {
    failType(x, STRING);
  }
}

function assertUInt(x) {
  if (!isUInt(x)) {
    failType(x, UINT);
  }
}

function assertFunction(x) {
  if (!isFunction(x)) {
    failType(x, FUNCTION);
  }
}

module.exports = {
  BOOLEAN: BOOLEAN,
  FUNCTION: FUNCTION,
  NUMBER: NUMBER,
  OBJECT: OBJECT,
  STRING: STRING,
  UNDEFINED: UNDEFINED,

  ARRAY_PROTOTYPE: ARRAY_PROTOTYPE,
  FUNCTION_PROTOTYPE: FUNCTION_PROTOTYPE,
  OBJECT_PROTOTYPE: OBJECT_PROTOTYPE,

  assertArray: assertArray,
  assertBoolean: assertBoolean,
  assertBuffer: assertBuffer,
  assertDate: assertDate,
  assertDefined: assertDefined,
  assertError: assertError,
  assertFunction: assertFunction,
  assertInt: assertInt,
  assertMap: assertMap,
  assertNull: assertNull,
  assertNumber: assertNumber,
  assertObject: assertObject,
  assertRegExp: assertRegExp,
  assertString: assertString,
  assertUInt: assertUInt,
  assertUndefined: assertUndefined,

  hasDefaultPrototype: hasDefaultPrototype,
  hasOwnProperty: hasOwnProperty,

  isArray: isArray,
  isBoolean: isBoolean,
  isBuffer: isBuffer,
  isDate: isDate,
  isDefined: isDefined,
  isError: isError,
  isInt: isInt,
  isFunction: isFunction,
  isMap: isMap,
  isNull: isNull,
  isNumber: isNumber,
  isObject: isObject,
  isRegExp: isRegExp,
  isString: isString,
  isUInt: isUInt,
  isUndefined: isUndefined
};
