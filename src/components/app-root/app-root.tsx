import { Component } from '@stencil/core';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <stencil-router>
            <stencil-route url='/' component='app-home' exact={true}>
            </stencil-route>

            <stencil-route url='/profile/:name' component='app-profile'>
            </stencil-route>
            <stencil-route url='/add' component='app-add'>
            </stencil-route>
            <stencil-route url='/universe' component='app-universe'>
            </stencil-route>
            <stencil-route url='/gameoflife' component='app-gameoflife'>
            </stencil-route>
          </stencil-router>
        </main>
      </div>
    );
  }
}
