import * as d from '../stencil/src/declarations';

import "./build";
import { defineCustomElement, h } from './define';
import { toDashCase } from '../../stencil/src/util/helpers';

const propertiesMap = new WeakMap<object, Map<string, object>>();
const eventsMap = new WeakMap<object, Map<string, object>>();

export { h };

type Type = { type: StringConstructor | NumberConstructor | BooleanConstructor | "Any" };

export function Component(opts?: d.ComponentOptions): ClassDecorator {
  return <TFunction extends Function>(Impl: TFunction): TFunction | void => {

    // console.log(import.meta.url);
    // fetch(opts.styleUrl).then(x => x.text()).then(x => console.log(x))

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

    defineCustomElement(window, (Impl as any).COMPONENTS as d.ComponentHostData, {
      hydratedCssClass: 'hydrated',
      namespace: opts.tag,
      // resourcesUrl?: string;
      // exclude?: string[];
    }, Impl as d.ComponentConstructor).then(x => console.log(x));
  }
}

export function Element(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = {
      elementRef: true,
    };
    propertiesMap.set(target, properties)
  };
}

export function Prop(opts?: d.PropOptions & Type): PropertyDecorator {
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
  };
}

export function Method(_opts?: d.MethodOptions): MethodDecorator {
  return <T>(target: object, propertyKey: string, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = {
      method: true,
    };
    propertiesMap.set(target, properties)
  };
}

export function State(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const properties = propertiesMap.get(target) || {} as any;
    properties[propertyKey] = {
      state: true,
    };
    propertiesMap.set(target, properties)
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
      eventName: toDashCase(propertyKey),
      method: propertyKey,
      bubbles: true,
      cancelable: true,
      composed: true,
      ...opts,
    });
    eventsMap.set(target, events);
  };
}
