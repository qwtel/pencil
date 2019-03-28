import * as d from '../stencil/src/declarations';
import { toDashCase } from '../stencil/src/util/helpers';
import { formatBrowserLoaderComponent } from '../stencil/src/util/data-serialize'

import './BUILD';
import { h, defineCustomElement } from './define';

import { getComponentDecoratorMeta } from './decorators/component-decorator';
import { getElementDecoratorMeta } from './decorators/element-decorator';
import { getPropDecoratorMeta } from './decorators/prop-decorator';
import { getMethodDecoratorMeta } from './decorators/method-decorator';
import { getStateDecoratorMeta } from './decorators/state-decorator';
import { updateWatchDecoratorMeta } from './decorators/watch-decorator';
import { getEventDecoratorMeta } from './decorators/event-docorator';

export { ComponentDidLoad, ComponentDidUnload, ComponentDidUpdate, ComponentWillLoad, ComponentWillUpdate, ComponentInstance as ComponentInterface, StencilConfig as Config, EventEmitter, EventListenerEnable, FunctionalComponent, QueueApi, JSXElements, Hyperscript } from '../stencil/src/declarations/index';

export { h };

export type Type = StringConstructor | NumberConstructor | BooleanConstructor | "Any";
export type PencilPropOptions = { type: Type, required?: boolean, optional?: boolean };

const propertiesMap = new WeakMap<object, Map<string, object>>();
const eventsMap = new WeakMap<object, Map<string, object>>();

const membersMetaMap = new WeakMap<object, d.MembersMeta>();
const eventsMetaMap = new WeakMap<object, d.EventMeta[]>();
const listenMetaMap = new WeakMap<object, d.ListenMeta[]>();

export function Component(opts?: d.ComponentOptions): ClassDecorator {
  return <TFunction extends Function>(Impl: TFunction): TFunction | void => {
    Object.defineProperty(Impl, 'is', {
      enumerable: true,
      get() { return opts.tag },
    });

    if (opts.shadow) {
      Object.defineProperty(Impl, 'encapsulation', {
        enumerable: true,
        get() { return 'shadow' },
      });
    }

    // if (opts.styleUrl) {
    //   Object.defineProperty(Impl, 'style', {
    //     enumerable: true,
    //     get() { console.log('reading?'); return `/**style-placeholder:${opts.tag}:**/` },
    //   });
    // }

    if (propertiesMap.get(Impl.prototype)) {
      Object.defineProperty(Impl, 'properties', {
        enumerable: true,
        get() { return propertiesMap.get(Impl.prototype); },
      });
    }

    if (eventsMap.get(Impl.prototype)) {
      Object.defineProperty(Impl, 'events', {
        enumerable: true,
        get() { return eventsMap.get(Impl.prototype); },
      });
    }

    const cmpData = formatBrowserLoaderComponent({
      ...getComponentDecoratorMeta(opts),
      bundleIds: { modeName: '' },
      membersMeta: membersMetaMap.get(Impl.prototype),
      eventsMeta: eventsMetaMap.get(Impl.prototype),
      listenersMeta: listenMetaMap.get(Impl.prototype),
      componentConstructor: Impl as d.ComponentConstructor,
      componentClass: Impl.name,
    });

    defineCustomElement(window, [cmpData], {
      hydratedCssClass: 'hydrated',
      namespace: opts.tag,
      resourcesUrl: undefined, // string;
      exclude: undefined, // string[];
    }, Impl as d.ComponentConstructor);
  }
}

export function Element(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = { elementRef: true };
    propertiesMap.set(target, properties)

    const membersMeta = membersMetaMap.get(target) || {} as d.MembersMeta;
    membersMetaMap.set(target, { ...membersMeta, ...getElementDecoratorMeta(propertyKey) });
  };
}

export function Prop(opts?: d.PropOptions & PencilPropOptions): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const properties = propertiesMap.get(target) || {} as any;
    const entry = properties[propertyKey];
    properties[propertyKey] = {
      ...entry,
      type: "Any",
      attr: toDashCase(propertyKey),
      ...opts,
    };
    propertiesMap.set(target, properties)

    const membersMeta = membersMetaMap.get(target) || {} as d.MembersMeta;
    membersMetaMap.set(target, { ...membersMeta, ...getPropDecoratorMeta(opts, propertyKey) });
  };
}

export function Method(opts?: d.MethodOptions): MethodDecorator {
  return <T>(target: object, propertyKey: string, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = { method: true };
    propertiesMap.set(target, properties)

    const membersMeta = membersMetaMap.get(target) || {} as d.MembersMeta;
    membersMetaMap.set(target, { ...membersMeta, ...getMethodDecoratorMeta(opts, propertyKey) });
  };
}

export function State(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = { state: true };
    propertiesMap.set(target, properties)

    const membersMeta = membersMetaMap.get(target) || {} as d.MembersMeta;
    membersMetaMap.set(target, { ...membersMeta, ...getStateDecoratorMeta(propertyKey) });
  };
}

export function Watch(propName: string): MethodDecorator {
  return <T>(target: object, propertyKey: string, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    const properties = propertiesMap.get(target) || {} as any;
    const entry = properties[propName];
    properties[propName] = {
      ...entry,
      watchCallbacks: (entry.watchCallbacks || []).concat(propertyKey),
    };
    propertiesMap.set(target, properties)

    const membersMeta = membersMetaMap.get(target) || {} as d.MembersMeta;
    updateWatchDecoratorMeta(propertyKey, propName, membersMeta);
  };
}

export function Listen(_eventName: string, _opts?: d.ListenOptions): MethodDecorator {
  return <T>(_target: object, _propertyKey: string, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    throw Error("Not implemented");
  };
}

export function Event(opts?: d.EventOptions): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const events = eventsMap.get(target) || [] as any;
    events.push({
      name: toDashCase(propertyKey),
      method: propertyKey,
      bubbles: true,
      cancelable: true,
      composed: true,
      ...opts,
    });
    eventsMap.set(target, events);

    const eventsMeta = eventsMetaMap.get(target) || [] as any;
    eventsMetaMap.set(target, [...eventsMeta, getEventDecoratorMeta(propertyKey, opts)]);
  };
}
