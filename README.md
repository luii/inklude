# Inklude

Inklude is an module which provides straight-forward, powerfil functions for including Node.js Modules.

## Getting started

### Features

Inklude has some special features to offer:

- [x] include a directory
- [x] flag a directory as optional
- [x] aggregate multiple plain objects together
- [x] exclude a directory
- [x] filter files out
- [ ] include multiple directorys at once
- [ ] filter for specific directorys

### Installation

The source is available for download from **[Github](https://github.com/luii/inklude)**. Alternatively, you can install using **NPM** *(Node Package Manager)*:

```
npm install inklude
```

Or you just add this line to your repository field in your ```package.json``` and your're pretty much done.

```json
"dependencies": {
  "inklude": "1.0.0"
}
```

### Quick usage

First you need to require the Package. After this you can just call include with two (2) parameters, like this

```js
var options = {
  dirname: process.cwd() + "/yourdir",
  exclude: /^\.(git|svn)$/,
  filter:  /(.*)/
};

inklude(options, function (err, res) {
  if (err) return callback(err);
  if (!res) return callback(new Error("Something went totally wrong!!!"));

  console.log(res);
});
```

## Documentation

**Comming soon!**

## License

The **Inklude** Package is open-sourced software licensed under the BSD-3-Clause
