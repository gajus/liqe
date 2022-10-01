/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable no-new-func */

import {
  createGetValueFunctionBody,
} from './createGetValueFunctionBody';
import {
  isOptionalChainingSupported,
} from './isOptionalChainingSupported';
import {
  isSafePath,
} from './isSafePath';
import type {
  ParserAst,
  HydratedAst,
} from './types';

const optionalChainingIsSupported = isOptionalChainingSupported();

export const hydrateAst = (subject: ParserAst): HydratedAst => {
  const newSubject: HydratedAst = {
    ...subject,
  };

  if (
    optionalChainingIsSupported &&
    subject.type === 'Tag' &&
    subject.field.type === 'Field' &&
    'field' in subject &&
    isSafePath(subject.field.name)
  ) {
    newSubject.getValue = new Function('subject', createGetValueFunctionBody(subject.field.name)) as (subject: unknown) => unknown;
  }

  if ('left' in subject) {
    newSubject.left = hydrateAst(subject.left);
  }

  if ('right' in subject) {
    newSubject.right = hydrateAst(subject.right);
  }

  if ('operand' in subject) {
    newSubject.operand = hydrateAst(subject.operand);
  }

  return newSubject;
};
