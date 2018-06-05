import { Component, Element, State } from '@stencil/core';


@Component({
  tag: 'app-universe',
  styleUrl: 'app-universe.css'
})
export class AppUniverse {

    @Element() el:HTMLElement;
    @State() wSize: any;
    @State() pause: boolean = false;
    cnvEl: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bcr: ClientRect;
    stars: Array<any> = [];
    planets: Array<any> = [];
    width: number;
    height: number;

    componentWillLoad() {
        this.pause = false;
        this.init();
    }
    componentDidUnload() {
        this.width = 0;
        this.height = 0;
        this.pause = true;
    }
    componentDidLoad() {
        this.cnvEl = this.el.querySelector("#canvas");
        this.ctx = this.cnvEl.getContext('2d');
        // define planets
        this.definePlanets();
        this.renderCanvas();
     }
    init() {
        this.wSize = this.windowSize(); 
        window.addEventListener('resize',this._debounce(this._windowResize,100,false),false);
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
         this.wSize = this.windowSize();
         this.pause = true;
         this.renderCanvas();
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

        // Fetch and instantiate the module
        fetch("assets/wasm/n-body-system.wasm")
        .then(response => response.arrayBuffer())
        .then(buffer => WebAssembly.instantiate(buffer, {
            env: { abort: function() {} }
        }))
        .then(module => {
            let exports:any = module.instance.exports;
            let mem: Float64Array = new Float64Array(exports.memory.buffer);
            let uni = this;
            exports.init();

            // Update about 30 times a second
            (function update() {
                setTimeout(update, 1000 / 30);
                for (var i = 0; i < 3; ++i) exports.step();
            })();
            uni.pause = false;
            // Keep rendering
            (function render() {
                if(uni.pause || (uni.width === 0 && uni.height === 0)) return;
                requestAnimationFrame(render);
                let scale: number = Math.min(uni.width,uni.height) / 700;
                let cx: number = uni.width / 2;
                let cy: number = uni.height / 2;
                uni.ctx.clearRect(0, 0, uni.width, uni.height);
                for (let i: number = 0, k = uni.stars.length; i < k; ++i) {
                    let star = uni.stars[i];
                    uni.ctx.fillStyle = "#fff";
                    uni.ctx.beginPath();
                    uni.ctx.globalAlpha = 0.5 + 0.5 * Math.random();
                    uni.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
                    uni.ctx.fill();
                }
                uni.ctx.globalAlpha = 1.0;
                for (let i = 0;; ++i) {
                    let body = exports.getBody(i);
                    if (!body) break;
                    let ptr = body >>> 3;
                    let x = mem[ptr];
                    let y = mem[ptr + 1];
                    //let z = mem[ptr + 2];
                    //let m = mem[ptr + 6];
                    uni.ctx.fillStyle = uni.planets[i].color;
                    uni.ctx.beginPath();
                    uni.ctx.arc(cx + x * 10 * scale, cy + y * 10 * scale, 2 * uni.planets[i].r * scale * 1.1, 0, 2 * Math.PI);
                    uni.ctx.fill();
                }
            })();
        }).catch(err => {
            alert("Failed to load WASM: " + err.message + " (ad blocker, maybe?)");
            console.log(err.stack);
            this.pause = true;
        });
        
    }
    render() {
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
