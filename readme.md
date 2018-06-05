# Stencil App using Webassembly

This Stencil App use a simple approach to use Webassembly without interfering with the compiling Stencil process. It is the result of curiosity and few days work to answer the following question " Can we integrate and use the WebAssembly technology inside Stencil? " which was posted in the Slack Stencil General Channel.
The approach taken consist of:

- creating Webassembly .wasm files outside Stencil in WebAssembly Studio https://webassembly.studio/
- include the .wasm files in your Stencil App as assets

WebAssembly Studio can create .wasm files from C, Rust and AssemblyScript (Typescript) Projects.

The application demonstrates the use of:

- add integer number created in a c project and compile as add.wasm in WebAsembly Studio
- n-body solar system taken from the AssemblyScript example https://github.com/AssemblyScript/assemblyscript/tree/master/examples/n-body
- game of life taken also from the AssemblyScript example https://github.com/AssemblyScript/assemblyscript/tree/master/examples/game-of-life

In the game of life, if you are clicking on the canvas, you will be adding some new lifes on the vertical and horizontal lines crossing at your clicking point.


## Getting Started

To start a new project using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/jepiqueau/stencil-webassembly-examples.git my-app
cd my-app
git remote rm origin
```

and run:

```bash
npm install
```

go to you editor of choice and open @types/webassembly-js-api/index.d.ts
after the second function instantiate add the following function definition:

```
function instantiateStreaming(source: Response | Promise<Response>, importObject?: any): Promise<ResultObject>;
```

Now, you are ready to run:
```bash
npm start
```


To view the build, start an HTTP server inside of the `/www` directory.

To watch for file changes during development, run:

```bash
npm run dev
```

To build the app for production, run:

```bash
npm run build
```

To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```
