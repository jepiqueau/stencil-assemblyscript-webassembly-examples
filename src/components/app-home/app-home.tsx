import { Component } from '@stencil/core';


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {


  render() {
    return (
      <div class='app-home'>
        <p>
          Welcome to the Stencil App Starter.
          You can use this starter to build entire apps all with
          web components using Stencil!
          Check out our docs on <a href='https://stenciljs.com'>stenciljs.com</a> to get started.
        </p>

        <stencil-route-link url='/profile/stencil'>
          <button>
            Profile page
          </button>
        </stencil-route-link>
        <stencil-route-link url='/add'>
          <button>
            Add Numbers
          </button>
        </stencil-route-link>
        <stencil-route-link url='/int-operators'>
          <button>
          Int Operators
          </button>
        </stencil-route-link>
        <stencil-route-link url='/universe'>
          <button>
            Draw Universe
          </button>
        </stencil-route-link>
        <stencil-route-link url='/gameoflife'>
          <button>
            Play Game of Life
          </button>
        </stencil-route-link>
      </div>
    );
  }
}
