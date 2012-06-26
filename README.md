type: Type predicates and assertions for Node
=============================================

This Node module is meant to provide a unified place to ask and
assert about all the built-in JavaScript and Node types.

Further documentation coming soon.


Building and Installing
-----------------------

```shell
npm install typ
```

Or grab the source. As of this writing, this module has no
dependencies, so once you have the source, there's nothing more to do
to "build" it.


Testing
-------

```shell
npm test
```

Or

```shell
node ./test/test.js
```


API Details
-----------

Constants
---------

This module provides some convenient constants. With regards to the
string constants, the author finds it handy to use them instead of
quoted strings, since that makes typos cause more blatant errors.

### BOOLEAN

This is what's returned by `typeof` when given a boolean value.

### FUNCTION

This is what's returned by `typeof` when given a function value.

### NUMBER

This is what's returned by `typeof` when given a numeric value.

### OBJECT

This is what's returned by `typeof` when given an object value.

### STRING

This is what's returned by `typeof` when given a string value.

### UNDEFINED

This is what's returned by `typeof` when given `undefined`.

### ARRAY_PROTOTYPE

This is the object prototype of array instances.

### FUNCTION_PROTOTYPE

This is the object prototype of function instances.

### OBJECT_PROTOTYPE

This is the default object prototype.


Assertion Functions
-------------------

Coming soon!


Miscellaneous Functions
-----------------------

### hasDefaultPrototype(obj) -> boolean

Returns `true` if and only if the given object's prototype is the
default one. That is, this is just a convenient way to say:

```
Object.getPrototypeOf(obj) === OBJECT_PROTOTYPE
```

### hasOwnProperty(obj, name) -> boolean

This is a safe version of the per-object `hasOwnProperty()` method.
You should use this any time you can't be 100% sure that the object
you're checking won't possibly have a binding for `"hasOwnProperty"`.


To Do
-----

* Flesh out docs.


Contributing
------------

Questions, comments, bug reports, and pull requests are all welcome.
Submit them at [the project on GitHub](https://github.com/Obvious/leb/).

Bug reports that include steps-to-reproduce (including code) are the
best. Even better, make them in the form of pull requests that update
the test suite. Thanks!


Author
------

[Dan Bornstein](https://github.com/danfuzz)
([personal website](http://www.milk.com/)), supported by
[The Obvious Corporation](http://obvious.com/).


License
-------

Copyright 2012 [The Obvious Corporation](http://obvious.com/).

Licensed under the Apache License, Version 2.0. 
See the top-level file `LICENSE.txt` and
(http://www.apache.org/licenses/LICENSE-2.0).
