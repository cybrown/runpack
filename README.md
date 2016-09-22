# runpack
[![Build Status](https://travis-ci.org/cybrown/runpack.svg?branch=master)](https://travis-ci.org/cybrown/runpack)

A ready to run, zero configuration webpack and webpack-dev-server build tool, without project generation.

Babel with ES2016, JSX, TypeScript, Sass, Less and autoprefixer are supported by default.

Included: dev server, unit tests, coverage, and more ! (see features)

## Installation

```
npm i -g runpack
```
You may also use it as a dev dependency.²

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

Run the developpment server with a backend server:
```
runpack server --proxy http://localhost:8080
```

Build production files in /dist:
```
runpack build
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
 * Developpment server
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
 * Create zip ou tar.gz archives
 * Works with any framework installable via npm, such as angular.js, angular2 or react
 * Uses hashes for cache-busting
 * History API fallback enabled by default
 * Proxy unresolved requests to a backend server
