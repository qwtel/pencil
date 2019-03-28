import * as d from '../../stencil/src/declarations';
// import { isDecoratorNamed, isPropertyWithDecorators } from './utils';
import { MEMBER_TYPE } from '../../stencil/src/util/constants';
// import ts from 'typescript';


export function getStateDecoratorMeta(propertyKey: string) {
  return {
    [propertyKey]: {
      memberType: MEMBER_TYPE.State,
    },
  };
  //   return classNode.members
  //     .filter(isPropertyWithDecorators)
  //     .reduce((membersMeta, member) => {
  //       const elementDecorator = member.decorators.find(isDecoratorNamed('State'));

  //       if (elementDecorator) {
  //         membersMeta[member.name.getText()] = {
  //           memberType: MEMBER_TYPE.State
  //         };
  //       }

  //       return membersMeta;
  //     }, {} as d.MembersMeta);
}
