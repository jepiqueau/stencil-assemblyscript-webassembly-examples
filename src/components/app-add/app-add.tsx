import { Component, Element, State } from '@stencil/core';


@Component({
  tag: 'app-add',
  styleUrl: 'app-add.css'
})
export class AppAdd {

  @Element() el:HTMLElement;
  @State() value: number;
  componentDidLoad() {
    this.addNumber(15,32);
    /*
    WebAssembly.instantiateStreaming(fetch("assets/wasm/add.wasm"), {
      env: {
        sayHello: function() {
          console.log("Hello from WebAssembly!");
        },
        abort: function(msg, file, line, column) {
          console.log('msg ', msg)
          console.log('file ', file)
          console.error("abort called at main.ts:" + line + ":" + column);
        }
      }
    }).then(result => {
      const exports = result.instance.exports;
      let addEl:HTMLDivElement = this.el.querySelector("#add");
      addEl.innerText = "Result: " + exports.add(19, 23);
    });
    */
  }
  async addNumber(a:number, b:number) {
    let add: WebAssembly.ResultObject = await WebAssembly.instantiateStreaming(fetch("assets/wasm/add.wasm"), {
      env: {
        sayHello: function() {
          console.log("Hello from WebAssembly!");
        },
        abort: function(msg, file, line, column) {
          console.log('msg ', msg)
          console.log('file ', file)
          console.error("abort called at main.ts:" + line + ":" + column);
        }
      }
    });
    const exports = add.instance.exports;
    let addEl:HTMLDivElement = this.el.querySelector("#add");
    addEl.innerText = "Result: " + exports.add(a, b);
  
  }
  render() {
    return (
      <div class='app-add'>
        <p>
          Add to numbers using WebAssembly
        </p>
        <div id="add">
        </div>
      </div>
    );
  }
}
