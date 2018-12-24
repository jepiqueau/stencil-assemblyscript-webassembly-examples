import { Component, Element, State } from '@stencil/core';
import { initWasm } from '../../utils/wasminit';


@Component({
  tag: 'app-int-operators',
  styleUrl: 'app-int-operators.css',
  shadow: true
})
export class AppIntOperators {

  @Element() el:HTMLElement;
  @State() update:boolean = false;
  asMod: any;
  componentWillLoad() {
    const impObj:any = {
      env: {
        abort: function(msg, file, line, column) {
          console.log('msg ', msg)
          console.error("abort called at " + file + ":" + line + ":" + column);
        }
      }
    }
    initWasm('wasm/int-operators.wasm',impObj).then((result) => {
      this.asMod = result.instance.exports;
      this.update = true;
    });
  }
  addNumber(a:number, b:number) {
    let addEl:HTMLDivElement = this.el.shadowRoot.querySelector("#add");
    addEl.innerText = "Addition Result: " + this.asMod.add(a, b);
  }
  substractNumber(a:number, b:number) {
    let addEl:HTMLDivElement = this.el.shadowRoot.querySelector("#substract");
    addEl.innerText = "Substraction Result: " + this.asMod.substract(a, b);
  }
  multNumber(a:number, b:number) {
    let addEl:HTMLDivElement = this.el.shadowRoot.querySelector("#mult");
    addEl.innerText = "Multiplication Result: " + this.asMod.mult(a, b);
  }
  divNumber(a:number, b:number) {
    let addEl:HTMLDivElement = this.el.shadowRoot.querySelector("#div");
    addEl.innerText = "Division Result: " + this.asMod.div(a, b);
  }
  intOperators() {
    this.addNumber(30,15);
    this.substractNumber(30,15);
    this.multNumber(30,15);
    this.divNumber(30,15);
  }
  render() {
    if(this.update) this.intOperators();
    return (
      <div class='app-int-operators'>
        <p>
          Integer Operators on two numbers (30,15) using WebAssembly
        </p>
        <div id="add">
        </div>
        <div id="substract">
        </div>
        <div id="mult">
        </div>
        <div id="div">
        </div>
      </div>
    );
  }
}
