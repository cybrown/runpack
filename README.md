# runpack
[![Build Status](https://travis-ci.org/cybrown/runpack.svg?branch=master)](https://travis-ci.org/cybrown/runpack)

A ready to run, zero configuration webpack and webpack-dev-server build tool, without project generation.

Babel with ES2016, JSX, TypeScript, LESSCSS and autoprefixer are supported by default.

Included: dev server, unit tests, coverage, and more !

## Installation

```
npm i -g runpack
```
You may also use it as a dev dependency.

## Project initialisation

Create an index.js or main.js file at the root of your project. You may also use .jsx, .ts or .tsx.

A package.json is not necessary, but if present and the main field is an existing file, it will be used as the entry point.

An index.html file is not mandatory, but if one is found next to the main file, it will be used.

## Usage

Run the developpment server (default port is already 3000):
```
$ runpack server --port 3000
```

Build production files in /dist:
```
$ runpack build
```

Create a production archive (zip and .tar.gz are supported):
```
$ runpack package --type tgz
```

Run tests with mocha:
```
$ runpack test
```

Run tests with mocha and generate test reports:
```
$ runpack test --test-report
```

Run tests with mocha and generate a coverage report:
```
$ runpack test --coverage
```

## Special Thanks
@flovy
