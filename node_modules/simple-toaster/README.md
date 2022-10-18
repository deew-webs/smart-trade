# Simple toaster

An elegant and simple notification for javascript, with no dependencies


Features
--------

+ Simple CSS-animated customizable toast pop-ups for any design
+ No dependencies and `< 1kb` code
+ Toasts appear and disappear by specifying optional timeout


Installation & Usage
--------------------

Simple-toaster is primarily ES6 module. See it in action:

```bash
npm i simple-toaster
```

```javascript
import simpleToaster from "simple-toaster"

simpleToaster('success', 'Hello Toaster!')
```

Parameters:
```javascript
simpleToaster(
  'error',    // Toaster style type. Pre-defined: error, warning or success
  'message',  // Message
  false       // Timeout in ms (default: 5000)
)

```

Import the style

```javascript
@import ~simple-toaster/src/simple-toaster // or '~simple-toaster/dist/simple-toaster.min.css'
```
