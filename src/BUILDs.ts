(window as any)._BUILD_ = {
  coreId: 'esm.es2017',
  polyfills: false,
  es5: false,
  cssVarShim: false,
  clientSide: true,
  browserModuleLoader: false,
  externalModuleLoader: true,

  // dev
  isDev: true,
  isProd: false,
  devInspector: false,
  hotModuleReplacement: false,
  verboseError: false,
  profile: false,

  // ssr
  ssrServerSide: false,
  prerenderClientSide: false,
  prerenderExternal: false,

  // encapsulation
  styles: true,
  hasMode: true,

  // dom
  shadowDom: true,
  scoped: false,
  slotPolyfill: false,

  // vdom
  hostData: true,
  hostTheme: true,
  reflectToAttr: true,

  // decorators
  element: true,
  event: true,
  listener: true,
  method: true,
  propConnect: true,
  propContext: true,
  prop: true,
  propMutable: true,
  state: true,
  watchCallback: true,
  hasMembers: true,
  updatable: true,

  // lifecycle events
  cmpDidLoad: true,
  cmpWillLoad: true,
  cmpDidUpdate: true,
  cmpWillUpdate: true,
  cmpDidUnload: true,

  // attr
  observeAttr: true,

  // elements
  hasSlot: true,
  hasSvg: true,

  ...(window as any)._BUILD_,
};