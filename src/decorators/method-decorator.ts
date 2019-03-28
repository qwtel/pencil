import * as d from '../../stencil/src/declarations';
// import { getAttributeTypeInfo, isDecoratorNamed, isMethodWithDecorators, serializeSymbol, typeToString } from '../stencil/src/compiler/transpile/datacollection/utils';
import { MEMBER_TYPE } from '../../stencil/src/util/constants';
// import { validatePublicName } from './reserved-public-members';
// import ts from 'typescript';
// import { buildWarn, normalizePath } from '../../util';


export function getMethodDecoratorMeta(methodOptions: d.MethodOptions, propertyKey: string): d.MembersMeta {
  // const memberMeta: d.MemberMeta = {};
  //   return classNode.members
  //     .filter(isMethodWithDecorators)
  //     .reduce((membersMeta, member: ts.MethodDeclaration) => {
  //       const methodDecorator = member.decorators.find(isDecoratorNamed('Method'));
  //       if (methodDecorator == null) {
  //         return membersMeta;
  //       }

  //   const symbol = checker.getSymbolAtLocation(member.name);
  // const methodName = propertyKey;
  //   const methodSignature = checker.getSignatureFromDeclaration(member);

  //   const flags = ts.TypeFormatFlags.WriteArrowStyleSignature | ts.TypeFormatFlags.NoTruncation;
  //   const returnType = checker.getReturnTypeOfSignature(methodSignature);
  //   const jsDocReturnTag = ts.getJSDocReturnTag(member);
  //   const typeString = checker.signatureToString(
  //     methodSignature,
  //     classNode,
  //     flags,
  //     ts.SignatureKind.Call
  //   );

  //   if (!config._isTesting && !isPromise(checker, returnType)) {
  //     const filePath = sourceFile.fileName;
  //     const warn = buildWarn(diagnostics);
  //     warn.header = '@Method requires async';
  //     warn.messageText = `External @Method() ${methodName}() should return a Promise or void.\n\n Consider prefixing the method with async, such as @Method async ${methodName}(). \n Next minor release will error.`;
  //     warn.absFilePath = normalizePath(filePath);
  //     warn.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, filePath));
  //   }

  //   let methodReturnTypes: d.AttributeTypeReferences = {};
  //   const returnTypeNode = checker.typeToTypeNode(returnType);

  //   if (returnTypeNode) {
  //     methodReturnTypes = getAttributeTypeInfo(returnTypeNode, sourceFile);
  //   }

  //   validatePublicName(diagnostics, componentClass, methodName, '@Method()', 'method');

  return {
    [propertyKey]: {
      memberType: MEMBER_TYPE.Method,
      attribType: {
        text: 'any', // TODO
        optional: false,
        required: false,
        //   typeReferences: {
        //     ...methodReturnTypes,
        //     ...getAttributeTypeInfo(member, sourceFile)
        //   }
      },
      // jsdoc: {
      //   ...serializeSymbol(checker, symbol),
      //   returns: {
      //     type: typeToString(checker, returnType),
      //     documentation: jsDocReturnTag ? jsDocReturnTag.comment : ''
      //   },
      //   parameters: methodSignature.parameters.map(parmSymbol =>
      //     serializeSymbol(checker, parmSymbol)
      //   )
      // }
    }
  };


  // return membersMeta;
  // }, {} as d.MembersMeta);
}

// function isPromise(checker: ts.TypeChecker, type: ts.Type) {
//   if (type.isUnionOrIntersection()) {
//     return false;
//   }
//   const typeText = typeToString(checker, type);
//   return typeText === 'void' || typeText.startsWith('Promise<');
// }
