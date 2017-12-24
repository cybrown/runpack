# runpack
[![Build Status](https://travis-ci.org/cybrown/runpack.svg?branch=master)](https://travis-ci.org/cybrown/runpack)

A ready to run, framework agnostic, zero configuration webpack 2 and webpack-dev-server build tool, without project generation.

Babel with ES2016, JSX, TypeScript, Sass, Less and autoprefixer are supported by default.

Included: dev server, unit tests, coverage, hot module replacement, and more ! (see features)

## Installation

```
npm i -g runpack
```
You may also use it as a dev dependency.

## Project initialisation

Create an index.js or main.js file at the root of your project. You may also use .jsx, .ts or .tsx.

A package.json is not necessary, but if present and the main field is an existing file, it will be used as the entry point.

An index.html file is not mandatory, but if one is found next to the main file, it will be used.

To use a css file (or sass/scss/less), simply include it with require or import, in your main javascript file:

```
// ES5:
require('./path/to/file.css');

// ES6 or TypeScript:
import './path/to/file.css';
```

## Usage

Run the developpment server (default port is already 3000):
```
runpack server --port 3000
```

Run the developpment server with cheap sourcemaps (faster builds but less precise sourcemaps, enable it on large projects):
```
runpack server --cheap-sourcemap
```

Run the developpment server with a backend server:
```
runpack server --proxy http://localhost:8080
```

Run the developpment server with a backend server and html5 history API (mandatory if using both proxy and html5 type routing):
```
runpack server --proxy http://localhost:8080 --proxy-root /rest --proxy-root /api
```

Build production files in /dist:
```
runpack build
```

Run server with basic hot module replacement (styles are supported):
```
runpack server --hot
```

Run server with hot module replacement and React support (you must use <AppContainer /> and module.hot.accept from react-hot-loader as in [react-hot-ts](https://github.com/Glavin001/react-hot-ts/blob/master/src/index.tsx) to support hot module replacement in the application code):
```
runpack server --hot-react
```

Create a production archive (zip and .tar.gz are supported):
```
runpack package --type tgz
```

Run tests with mocha:
```
runpack test
```

Run tests and watch files:
```
runpack test --watch
```

Run tests with mocha and generate test reports:
```
runpack test --test-report
```

Run tests with mocha and generate a coverage report:
```
runpack test --coverage
```

Dump build scripts, generate npm commands and install dev depenencies (may be irreversible !):
```
runpack eject
```

By default, the favicon.png file next to your main javascript file will be used as a favicon, to define another path, use --favicon:
```
runpack server --favicon path/to/favicon
```

Get help:
```
runpack --help
```

Get help on a specific command:
```
runpack <command> --help
```

## Supported plateforms

 * Windows, Linux, OSX.
 * Nodejs >= 4.0.

## Features

 * No boilerplate generation
 * No lock-in with the "eject" command
 * No configuration generation
 * No complicated conventions (having one main script file is enough)
 * ES2016 (and JSX) with Babel
 * TypeScript
 * CSS preprocessors (Sass and Less)
 * Autoprefixer
 * Optimize images
 * Create production files
 * Run tests with karma and mocha
 * Watch mode for tests
 * Generate tests reports for CI tools
 * Generate code coverage
 * Create zip or tar.gz archives
 * Works with any framework installable via npm, such as angular.js, angular2 or react
 * Uses hashes for cache-busting
 * History API fallback enabled by default
 * Proxy unresolved requests to a backend server
 * Simple favicon support for dev server, production files and archive
 * Tree shaking (for Typescript, configure es2015 modules in the tsconfig.json file)
 * Hot module replacement (basic support for styles and specific React support)
 * Dependencies analyzer
