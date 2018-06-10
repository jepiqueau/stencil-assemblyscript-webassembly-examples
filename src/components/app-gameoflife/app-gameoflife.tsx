import { Component, Element, State } from '@stencil/core';
import { initWasm } from '../../utils/wasminit';

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
    @State() rdCanvas: boolean = false;
    @State() toggle:boolean = false;
    cnvEl: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bcr: ClientRect;
    width: number;
    height: number;
    size : number;
    loc: any;
    click: boolean;
    asMod: any;
    tOutRef: NodeJS.Timer; 
    mem: Uint32Array;
    imageData: ImageData;
    argb: Uint32Array;
    cmpLoaded: Boolean; 

    componentWillLoad() {
        this.init();
        this.click = false;
        this.cmpLoaded = true;
    }
    componentDidUnload() {
        this.width = 0;
        this.height = 0;
        this.mem = null;
        this.imageData = null;
        this.argb = null;
        this.asMod = null;
        clearTimeout(this.tOutRef);
        this.cmpLoaded = false;
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
        if(this.cmpLoaded) {
            this.wSize = this.windowSize();
            this.mem = null;
            this.imageData = null;
            this.argb = null;
            this.rdCanvas = false;
            clearTimeout(this.tOutRef);
            this.renderCanvas();    
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
    rgb2bgr(rgb) {
        return ((rgb >>> 16) & 0xff) | (rgb & 0xff00) | (rgb & 0xff) << 16;
    }
    handleClick(ev) {
        ev.preventDefault();
        this.loc = {x: ev.pageX, y: ev.pageY}
        this.click = true;
    }
    updateStep() {
        if(this.width === 0 && this.height === 0 ) {
            clearTimeout(this.tOutRef);
            this.tOutRef = null;
            return;
        } else {
            this.tOutRef = setTimeout(() => {
                this.updateStep();
                this.mem.copyWithin(0, this.size, this.size + this.size);      // copy output to input
                this.asMod.step();                            // perform the next step
                this.toggle = ! this.toggle;
            },1000/30); // Update about 30 times a second    
        }
    }
    drawGame() {
        this.argb.set(this.mem.subarray(this.size, this.size + this.size)); // copy output to image buffer
        this.ctx.putImageData(this.imageData, 0, 0);         // apply image buffer
        if(this.click) {
            let bcr: ClientRect = this.cnvEl.getBoundingClientRect();
            this.asMod.fill((this.loc.x - bcr.left) >>> 1, (this.loc.y - bcr.top) >>> 1, 0.5);
            this.click = false;
        }
    };

    async renderCanvas(){
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
        let memory: WebAssembly.Memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });
        // instantiate the module
        const impObj:any = {
            env: {
                BGR_ALIVE : this.rgb2bgr(RGB_ALIVE) | 1, // little endian, LSB must be set
                BGR_DEAD  : this.rgb2bgr(RGB_DEAD) & ~1, // little endian, LSB must not be set
                BIT_ROT,
                memory,
                abort: function(msg, file, line, column) {
                    console.log('msg ', msg)
                    console.error("abort called at " + file + ":" + line + ":" + column);
                }
            },
            JSMath: Math
        }
        let res:any = await initWasm('wasm/game-of-life.wasm',impObj);
        this.asMod = res.instance.exports;
        // Initialize the module with the canvas's width and height
        this.asMod.init(this.width, this.height);
        this.mem = new Uint32Array(memory.buffer);
        this.updateStep();
        // Keep rendering the output at [size, 2*size]
        this.imageData = this.ctx.createImageData(this.width, this.height);
        this.argb = new Uint32Array(this.imageData.data.buffer);
        this.rdCanvas = true;
    }

    render() {
        if(this.rdCanvas) this.drawGame();
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
