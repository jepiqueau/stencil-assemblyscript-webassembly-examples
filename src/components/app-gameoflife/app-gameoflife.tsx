import { Component, Element, State } from '@stencil/core';

const RGB_ALIVE = 0xD392E6;
const RGB_DEAD  = 0xA61B85;
const BIT_ROT   = 10;

@Component({
  tag: 'app-gameoflife',
  styleUrl: 'app-gameoflife.css'
})
export class AppGameoflife {

    @Element() el:HTMLElement;
    @State() wSize: any;
    @State() pause: boolean = false;
    cnvEl: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bcr: ClientRect;
    width: number;
    height: number;
    size : number;
    memory: WebAssembly.Memory;
    loc: any;
    click: boolean;

    componentWillLoad() {
        // Configuration
        this.pause = false;
        this.click = false;
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
    rgb2bgr(rgb) {
        return ((rgb >>> 16) & 0xff) | (rgb & 0xff00) | (rgb & 0xff) << 16;
    }
    handleClick(ev) {
        ev.preventDefault();
        this.loc = {x: ev.pageX, y: ev.pageY}
        this.click = true;
    }

    renderCanvas(){
        let memory: WebAssembly.Memory = null;
        this.bcr = this.cnvEl.getBoundingClientRect();
        // Compute the size of the universe (here: 2px per cell)
        this.width = this.bcr.width >>> 1;
        this.height = this.bcr.height >>> 1;
        this.size = this.width * this.height;
        let byteSize: number = (this.size + this.size) << 2; // input & output (here: 4b per cell)
        this.cnvEl.width = this.width;
        this.cnvEl.height = this.height;
        this.ctx.imageSmoothingEnabled = false;
        // Compute the size of and instantiate the module's memory
        memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });
        // Fetch and instantiate the module
        fetch("assets/wasm/game-of-life.wasm")
        .then(response => response.arrayBuffer())
        .then(buffer => WebAssembly.instantiate(buffer, {
            env: {
                BGR_ALIVE : this.rgb2bgr(RGB_ALIVE) | 1, // little endian, LSB must be set
                BGR_DEAD  : this.rgb2bgr(RGB_DEAD) & ~1, // little endian, LSB must not be set
                BIT_ROT,
                memory,
                abort: function() {}
            },
            JSMath: Math
        }))
        .then(module => {
            var exports = module.instance.exports;
            let game = this;

            // Initialize the module with the universe's width and height
            exports.init(game.width, game.height);

            let mem: Uint32Array = new Uint32Array(memory.buffer);

            // Update about 30 times a second
            (function update() {
                setTimeout(update, 1000 / 30);
                mem.copyWithin(0, game.size, game.size + game.size);      // copy output to input
                exports.step();                            // perform the next step
            })();
            game.pause = false;
            // Keep rendering the output at [size, 2*size]
            let imageData: ImageData = game.ctx.createImageData(game.width, game.height);
            let argb: Uint32Array = new Uint32Array(imageData.data.buffer);
            (function render() {
                if(game.pause || (game.width === 0 && game.height === 0)) return;
                requestAnimationFrame(render);
                argb.set(mem.subarray(game.size, game.size + game.size)); // copy output to image buffer
                game.ctx.putImageData(imageData, 0, 0);         // apply image buffer
                if(game.click) {
                    let bcr: ClientRect = game.cnvEl.getBoundingClientRect();
                    exports.fill((game.loc.x - bcr.left) >>> 1, (game.loc.y - bcr.top) >>> 1, 0.5);
                    game.click = false;
                }
            })();
        }).catch(err => {
            alert("Failed to load WASM: " + err.message + " (ad blocker, maybe?)");
            console.log(err.stack);
        });
    }
    render() {
        return (
        <div id='game'> 
            <p id='p-title'>
            Game of life using WebAssembly
            </p>
            <canvas id="canvas"                      
            onClick={this.handleClick.bind(this)}>
            </canvas>
        </div>
        );
    }
}
