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
    typeof subject.field === 'string' &&
    isSafePath(subject.field)
  ) {
    newSubject.getValue = new Function('subject', createGetValueFunctionBody(subject.field)) as (subject: unknown) => unknown;
  }

  if (subject.left) {
    newSubject.left = hydrateAst(subject.left);
  }

  if (subject.right) {
    newSubject.right = hydrateAst(subject.right);
  }

  if (subject.operand) {
    newSubject.operand = hydrateAst(subject.operand);
  }

  return newSubject;
};
