# Pencil Runtime

__DEPRECATION NOTICE__: As it turns out, what I actually wanted was [LitElement](https://github.com/polymer/lit-element), which is very simialr in terms of API and usage.

Standalone [Stencil](https://stenciljs.com/) runtime.

*Stencil - Compiler + Extras = Pencil*

Alternative explanation: [SkateJS](https://github.com/skatejs/skatejs) with Stencil decorator syntax.

## Why
* Not dependent on TypeScript (only decorators are required)
* Build a single bundle using webpack/rollup
* No duplicate code (dependencies!)
* No polyfills
* ???

## Example

```jsx
// File: my-first-component.jsx

// Additional import of `h` is required to make `render` work.
import { h, Component, Prop } from 'pencil-runtime';

@Component({
  tag: 'my-first-component',
  shadow: true,
})
export class MyComponent {
  // Extra `type` parameter is necessary 
  // b/c it cannot be inferred at runtime.
  @Prop({ type: String, mutable: true, reflectToAttr: true }) name;

  render() {
    return (
      <p>
        Hello, {this.name}!
      </p>
    );
  }
}
```

Usage:

```js
// File: main.js
import `./my-first-component.jsx`;

// my-first-component is now defined:

const mfc = document.createElement('my-first-component');
mfc.name = "World";
document.body.appendChild(mfc;)
```
