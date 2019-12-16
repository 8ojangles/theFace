# Particle Engine

This is an implimentation of a Particle engine written in Javascript and displaying in a 2d Canvas contexts.

## Contents

A `compiledDist` folder has been provided in-case of any problems installing or building the project. The compiled files are un-minified/uglified to make easy to review.


## Installation

Requires `node.js` and `npm` to be installed on the host machine

- Open a cmd terminal and navigate to the project root

### `npm i`
Installs all dependancies


### Installation Notes
- although `Gulp` is a development dependancy it may be required to install this globally. In this case run `npm i -g gulp gulp-cli`.
- Version 4 of `Gulp` is required for this project
- if there are problems installing the dependancies, delete the `packagelock.json` file and retry

## Commands

Once a successful installation has been made the following commands are available in a cmd/terminal at the project root:

### `gulp build`

builds the project and runs tests


### `gulp watch`

Starts up a development server. open a browser and navigate to:
`localhost:<defaultport>/test.html` to see the test page.
i.e. [http://localhost:3000](http://localhost:3000)


### `gulp tests` or `npm test`

Run the test suite independantly

