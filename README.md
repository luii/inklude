# Inklude
With this module, you can require easy many files in a directory.

## Usage
```js
/**
 * Dependencies
 */
var inklude = require("inklude");

var dirs = inklude({
	dirname: __dirname + "/example_dir",
	filter:  place here your regex,
	exclude: place here your regex
});
```
