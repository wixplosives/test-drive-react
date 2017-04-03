# Test Drive React

Opinionated library for Test-Driven Development of React components, extending 
[Test Drive](https://github.com/wix/test-drive) and providing its 
[timing functions](https://github.com/wix/test-drive#waitfor-waitfordom),
[DOM parts lookup](https://github.com/wix/test-drive#locating-your-dom-parts-selectdom),
[presence/absence matchers](https://github.com/wix/test-drive#the-present-and-absent-matchers) and
[layout matchers](https://github.com/wix/test-drive#layout-matchers).

In addition, it reexports [React simulate](https://facebook.github.io/react/docs/test-utils.html#simulate)
testing utility and [integrated renderer](https://github.com/wix/test-drive-react#clientrenderer)


# ClientRenderer

`ClientRenderer` provides a utility for rendering React components in consistent
and convenient way. It creates the holding container, if necessary, with uniform positioning,
automatically binds to it all important Test Drive helper functions, and proivides clean-up
mechanism.

For a typical use, see the [end-to-end test](./test/e2e.spec.tsx). 

The renderer is created simply by invoking `new ClientRenderer()`.

## `render(element, container?)`

Renders the `element` React component. If `container` is not specified, a new one is created.
Returns `RenderingContext` with following fields:

 - `container`
 - `result` - rendered root component (either DOM Element or React component instance)
 - `select` - [DOM selector](https://github.com/wix/test-drive#locating-your-dom-parts-selectdom)
pre-bound to the container
 - `waitForDom` - [DOM timing function](https://github.com/wix/test-drive#waitfor-waitfordom)
pre-bound to the container

## `cleanup()`

Unmounts the root component and removes any container that had been created by the renderer.

