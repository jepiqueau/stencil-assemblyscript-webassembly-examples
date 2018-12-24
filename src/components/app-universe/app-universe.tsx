import { Component, Element, State } from '@stencil/core';
import { initWasm } from '../../utils/wasminit';


@Component({
  tag: 'app-universe',
  styleUrl: 'app-universe.css',
  shadow: true
})
export class AppUniverse {

    @Element() el:HTMLElement;
    @State() wSize: any;
    @State() update:boolean = false;
    @State() rdCanvas: boolean = false;
    @State() toggle:boolean = false;
    cnvEl: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bcr: ClientRect;
    stars: Array<any> = [];
    planets: Array<any> = [];
    width: number;
    height: number;
    asMod: any;
    mem: Float64Array;
    tOutRef: NodeJS.Timer;
    cmpLoaded: Boolean; 

    componentWillLoad() {
      const impObj:any = {
        env: {
          abort: function(msg, file, line, column) {
            console.log('msg ', msg)
            console.error("abort called at " + file + ":" + line + ":" + column);
          }
        }
      }
      initWasm('wasm/n-body-systems.wasm',impObj).then((result) => {
        this.asMod = result.instance.exports;
        this.mem = new Float64Array(this.asMod.memory.buffer);
        this.init();
        this.update = true;
        this.cmpLoaded = true;
      });
    }
  
    componentDidUnload() {
        this.width = 0;
        this.height = 0;
        this.mem = null;
        this.cmpLoaded = false;
        clearTimeout(this.tOutRef);
    }
    componentDidLoad() {
        this.cnvEl = this.el.shadowRoot.querySelector("#canvas");
        this.ctx = this.cnvEl.getContext('2d');
    }
    init() {
        this.wSize = this.windowSize(); 
        window.addEventListener('resize',this._debounce(this._windowResize,100,false),false);
        // define planets
        this.definePlanets();
        this.asMod.init();
    }
    windowSize(): any {
         return {
           top: 0,
           left: 0,
           width: window.innerWidth,
           height: window.innerHeight
         };
    }
    _windowResize(): void {
        if(this.cmpLoaded) {
            this.wSize = this.windowSize();
            this.rdCanvas = false;
            clearTimeout(this.tOutRef);
        }
    }
    _debounce(func:Function,wait:number,immediate:boolean) {
         let timeout: NodeJS.Timer;
         return () => {
             const context:this = this; 
             const args:IArguments = arguments;
             const later = () => {
                 timeout = null;
                 if (!immediate) func.apply(context, args);
             };
             const callNow:boolean  = immediate && !timeout;
             clearTimeout(timeout);
             timeout = setTimeout(later, wait);
             if (callNow) func.apply(context, args);
         };    
    }
    defineStars() {
        this.stars = [];
        for (let i: number = 0; i < 250; ++i) {
            let star:any  = {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            r: 0.3 + Math.random() * 0.8
            };
            this.stars.push(star);
        }  
    }
    definePlanets() {
        this.planets = [
            { color: "#f7d864", r: 8.00 },
            { color: "#e2b37d", r: Math.sqrt(11.21) },
            { color: "#cdb086", r: Math.sqrt(9.45) },
            { color: "#588bce", r: Math.sqrt(4.01) },
            { color: "#0f6ab0", r: Math.sqrt(3.88) }
        ];      
    }
    updateSteps() {
        if(this.width === 0 && this.height === 0 ) {
            clearTimeout(this.tOutRef);
            this.tOutRef = null;
            return;
        } else {
            this.tOutRef = setTimeout(() => {
                this.updateSteps();
                this.asMod.bench(3);
                this.toggle = ! this.toggle;
            },1000/30); // Update about 30 times a second    
        }
    }
    drawUniverse() {
        let scale: number = Math.min(this.width,this.height) / 700;
        let cx: number = this.width / 2;
        let cy: number = this.height / 2;
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i: number = 0, k = this.stars.length; i < k; ++i) {
            let star = this.stars[i];
            this.ctx.fillStyle = "#fff";
            this.ctx.beginPath();
            this.ctx.globalAlpha = 0.5 + 0.5 * Math.random();
            this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
        for (let i = 0;; ++i) {
            let body = this.asMod.getBody(i);
            if (!body) break;
            let ptr = body >>> 3;
            let x = this.mem[ptr];
            let y = this.mem[ptr + 1];
            this.ctx.fillStyle = this.planets[i].color;
            this.ctx.beginPath();
            this.ctx.arc(cx + x * 10 * scale, cy + y * 10 * scale, 2 * this.planets[i].r * scale * 1.1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    renderCanvas() {     
        // render Universe
        this.bcr = this.cnvEl.getBoundingClientRect();
        // Compute the size of the universe (here: 2px per cell)
        this.width = this.bcr.width;
        this.height = this.bcr.height;
        // Set size of universe
        this.cnvEl.width = this.width;
        this.cnvEl.height = this.height;
        this.ctx.imageSmoothingEnabled = false;
        // Add some random stars because stars
        // define stars
        this.defineStars();
        this.updateSteps();
        this.rdCanvas = true;
    }

    render() {
        if(this.update && !this.rdCanvas) this.renderCanvas();
        if(this.update && this.rdCanvas) this.drawUniverse();
        return (
        <div id='universe'>
            <p id='p-title'>
            N-Body System using WebAssembly
            </p>
            <canvas id="canvas">
            </canvas>
        </div>
        );
    }
}
