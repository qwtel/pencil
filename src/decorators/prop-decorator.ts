import * as d from '../../stencil/src/declarations';
// import { buildWarn, catchError } from '../stencil/src/compiler/util';
// import { getAttributeTypeInfo } from '../stencil/src/compiler/transpile/datacollection/utils';
import { MEMBER_TYPE, PROP_TYPE } from '../../stencil/src/util/constants';
import { toDashCase } from '../../stencil/src/util/helpers';
// import { validatePublicName } from '../stencil/src/compiler/transpile/datacollection/reserved-public-members';
// import ts from 'typescript';

import { Type, PencilPropOptions } from '../index';

export function getPropDecoratorMeta(propOptions: d.PropOptions & PencilPropOptions, propertyKey: string): d.MembersMeta {
  const memberData: d.MemberMeta = {};
  // const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));

  // if (propDecorator == null) {
  //   return allMembers;
  // }
  // const propOptions = getPropOptions(propDecorator, diagnostics);
  const memberName = propertyKey;
  // const symbol = checker.getSymbolAtLocation(prop.name);

  if (propOptions && typeof propOptions.connect === 'string') {
    // @Prop({ connect: 'ion-alert-controller' })
    memberData.memberType = MEMBER_TYPE.PropConnect;
    memberData.ctrlId = propOptions.connect;

  } else if (propOptions && typeof propOptions.context === 'string') {
    // @Prop({ context: 'config' })
    memberData.memberType = MEMBER_TYPE.PropContext;
    memberData.ctrlId = propOptions.context;

  } else {
    // @Prop()
    // const type = checker.getTypeAtLocation(prop);
    // validatePublicName(diagnostics, componentClass, memberName, '@Prop()', 'property');

    memberData.memberType = getMemberType(propOptions);
    memberData.attribName = getAttributeName(propOptions, memberName);
    memberData.attribType = getAttribType(propOptions, memberName);
    memberData.reflectToAttrib = getReflectToAttr(propOptions);
    memberData.propType = propTypeFromType(propOptions);
    // memberData.jsdoc = serializeSymbol(checker, symbol);

    // extract default value
    // const initializer = prop.initializer;
    // if (initializer) {
    //   memberData.jsdoc.default = initializer.getText();
    // }
  }

  return { [propertyKey]: memberData };
}

// function getPropOptions(propDecorator: ts.Decorator, diagnostics: d.Diagnostic[]) {
//   const suppliedOptions = (propDecorator.expression as ts.CallExpression).arguments
//     .map(arg => {
//       try {
//         const fnStr = `return ${arg.getText()};`;
//         return new Function(fnStr)();

//       } catch (e) {
//         // catchError(diagnostics, e, `parse prop options: ${e}`);
//       }
//     });

//   const propOptions: d.PropOptions = suppliedOptions[0];
//   return propOptions;
// }


function getMemberType(propOptions: d.PropOptions) {
  if (propOptions && propOptions.mutable === true) {
    return MEMBER_TYPE.PropMutable;
  }

  return MEMBER_TYPE.Prop;
}


function getAttributeName(propOptions: d.PropOptions, memberName: string) {
  if (propOptions && typeof propOptions.attr === 'string' && propOptions.attr.trim().length > 0) {
    return propOptions.attr.trim();
  }
  return toDashCase(memberName);
}


function getReflectToAttr(propOptions: d.PropOptions) {
  if (propOptions && propOptions.reflectToAttr === true) {
    return true;
  }

  return false;
}


function getAttribType(propOptions: d.PropOptions & PencilPropOptions, memberName: string) {
  let attribType: d.AttributeTypeInfo;

  // If the @Prop() attribute does not have a defined type then infer it
  // if (!prop.type) {
  let attribTypeText = inferPropType(propOptions.type);

  // if (!attribTypeText) {
  //   attribTypeText = 'any';

  // const diagnostic = buildWarn(diagnostics);
  // diagnostic.messageText = `Prop type provided is not supported, defaulting to any: '${prop.getFullText()}'`;
  // }

  attribType = {
    text: attribTypeText,
    required: propOptions.required && memberName !== 'mode',
    optional: propOptions.optional && !propOptions.required,
  };
  // } else {
  //   attribType = {
  //     text: prop.type.getText(),
  //     required: prop.exclamationToken !== undefined && memberName !== 'mode',
  //     optional: prop.questionToken !== undefined,
  //     // typeReferences: getAttributeTypeInfo(prop.type, sourceFile)
  //   };
  // }

  return attribType;
}

function inferPropType(type: Type) {
  if (type === String) {
    return 'string';
  }
  if (type === Number) {
    return 'number';
  }
  if (type === Boolean) {
    return 'boolean';
  }
  else {
    return 'any';
  }
}

function propTypeFromType(opts: d.PropOptions & PencilPropOptions) {
  // const isStr = checkType(type, isString);
  // const isNu = checkType(type, isNumber);
  // const isBool = checkType(type, isBoolean);
  // const isAnyType = checkType(type, isAny);
  const type = opts.type || 'Any';
  const isStr = type === String;
  const isNu = type === Number;
  const isBool = type === Boolean;
  const isAnyType = !isStr && !isNu && !isBool;

  if (isAnyType) {
    return PROP_TYPE.Any;
  }

  // if type is more than a primitive type at the same time, we mark it as any
  if (Number(isStr) + Number(isNu) + Number(isBool) > 1) {
    return PROP_TYPE.Any;
  }

  // at this point we know the prop's type is NOT the mix of primitive types
  if (isStr) {
    return PROP_TYPE.String;
  }
  if (isNu) {
    return PROP_TYPE.Number;
  }
  if (isBool) {
    return PROP_TYPE.Boolean;
  }
  return PROP_TYPE.Unknown;
}

// function checkType(type: ts.Type, check: (type: ts.Type) => boolean): boolean {
//   if (type.flags & ts.TypeFlags.Union) {
//     const union = type as ts.UnionType;
//     if (union.types.some(type => checkType(type, check))) {
//       return true;
//     }
//   }
//   return check(type);
// }

// function isBoolean(t: ts.Type) {
//   if (t) {
//     return !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLike));
//   }
//   return false;
// }

// function isNumber(t: ts.Type) {
//   if (t) {
//     return !!(t.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
//   }
//   return false;
// }

// function isString(t: ts.Type) {
//   if (t) {
//     return !!(t.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral));
//   }
//   return false;
// }

// function isAny(t: ts.Type) {
//   if (t) {
//     return !!(t.flags & ts.TypeFlags.Any);
//   }
//   return false;
// }
