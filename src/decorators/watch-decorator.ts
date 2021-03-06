import * as d from '../../stencil/src/declarations';
// import { buildError, buildWarn } from '../../util';
// import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators } from './utils';
// import ts from 'typescript';
import { MEMBER_TYPE } from '../../stencil/src/util/constants';


export function updateWatchDecoratorMeta(propertyKey: string, propName: string, membersMeta: d.MembersMeta) {
  if (isPropWatchable(membersMeta, propName)) {
    membersMeta[propName].watchCallbacks = membersMeta[propName].watchCallbacks || [];
    membersMeta[propName].watchCallbacks.push(propertyKey);
  }
}


// function getChangeMetaByName(/*diagnostics: d.Diagnostic[], methods: ts.ClassElement[], cmpMeta: d.ComponentMeta, decoratorName: string*/) {
// //   methods.forEach(({decorators, name}) => {
// //     decorators
// //       .filter(isDecoratorNamed(decoratorName))
// //       .forEach(propChangeDecorator => {
// //         const [propName] = getDeclarationParameters<string>(propChangeDecorator);
// //         if (propName) {
// //           updateWatchCallback(diagnostics, cmpMeta, propName, name, decoratorName);
// //         }
// //       });
// //   });
// }

// function updateWatchCallback(/*diagnostics: d.Diagnostic[], cmpMeta: d.ComponentMeta, propName: string, decoratorData: ts.PropertyName, decoratorName: string*/) {
//   if (!isPropWatchable(cmpMeta, propName)) {
//     //     const error = buildError(diagnostics);
//     //     error.messageText = `@Watch('${propName}') is trying to watch for changes in a property that does not exist.
//     // Make sure only properties decorated with @State() or @Prop() are watched.`;
//     //     return;
//     //   }
//     cmpMeta.membersMeta[propName].watchCallbacks = cmpMeta.membersMeta[propName].watchCallbacks || [];
//     cmpMeta.membersMeta[propName].watchCallbacks.push(decoratorData.getText());

//     //   if (decoratorName === 'PropWillChange' || decoratorName === 'PropDidChange') {
//     //     const diagnostic = buildWarn(diagnostics);
//     //     diagnostic.messageText = `@${decoratorName}('${propName}') decorator within "${cmpMeta.tagNameMeta}" component has been deprecated. Please update to @Watch('${propName}').`;
//     //   }
//   }

function isPropWatchable(membersMeta: d.MembersMeta, propName: string) {
  if (!membersMeta) {
    return false;
  }
  const member = membersMeta[propName];
  if (!member) {
    return false;
  }
  const type = member.memberType;
  return type === MEMBER_TYPE.State || type === MEMBER_TYPE.Prop || type === MEMBER_TYPE.PropMutable;
}
