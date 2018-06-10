# Stencil App using WebAssembly and AssemblyScript

This Stencil App demonstrates the use of Webassembly by integrating AssemblyScript in the compiling Stencil process.

The approach taken consist of:

- creating Webassembly typescript files in an assembly project folder
- compiling the WebAssembly typescript files to .wasm files stored in src/wasm folder
- developping Stencil Web Components using the WebAssembly .wasm files
- compiling Stencil Application

if you wish to use WebAssembly written in C, C++ or Rust, you create them outside the project, compile them with Emscripten and store the .wasm files directly into the src/wasm folder. (see example add.wasm written in C).

The application demonstrates the use of:

- add integer number created in a c project and compile as add.wasm in WebAsembly Studio
- integer operators (addition, substraction, multiplication, division)
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
npm run build-asc   // compile the assembly typescript files
npm start
```


To view the build, start an HTTP server inside of the `/www` directory.

To watch for file changes during development, run:

```bash
npm run dev
```

To build the app for production, run:

```bash
npm run build-asc   // compile the assembly typescript files
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
