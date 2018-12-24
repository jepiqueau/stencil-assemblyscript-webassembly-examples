import { Component, Element, State } from '@stencil/core';
import { initWasm } from '../../utils/wasminit';


@Component({
  tag: 'app-add',
  styleUrl: 'app-add.css',
  shadow: true
})
export class AppAdd {

  @Element() el:HTMLElement;
  @State() update:boolean = false;
  asMod: any;
  componentWillLoad() {
    const impObj:any = {
      env: {
        sayHello: function() {
          console.log("Hello from WebAssembly!");
        },
        abort: function(msg, file, line, column) {
          console.log('msg ', msg)
          console.error("abort called at " + file + ":" + line + ":" + column);
        }
      }
    }
    initWasm('wasm/add.wasm',impObj).then((result) => {
      this.asMod = result.instance.exports;
      this.update = true;
    });
  }
  async addNumber(a:number, b:number) {
    let addEl:HTMLDivElement = this.el.shadowRoot.querySelector("#add");
    addEl.innerText = "Result: " + this.asMod.add(a, b);
  
  }
  render() {
    if(this.update) this.addNumber(15,32);
    return (
      <div class='app-add'>
        <p>
          Add to numbers (15,32) using WebAssembly
        </p>
        <div id="add">
        </div>
      </div>
    );
  }
}
