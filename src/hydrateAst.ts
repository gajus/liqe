/* eslint-disable no-new-func */

import { createGetValueFunctionBody } from './createGetValueFunctionBody';
import { isSafePath } from './isSafePath';
import {
  type LiqeQuery,
  type ParenthesizedExpressionToken,
  type ParserAst,
} from './types';

export const hydrateAst = (subject: ParserAst): LiqeQuery => {
  const newSubject: LiqeQuery = {
    ...subject,
  };

  if (
    subject.type === 'Tag' &&
    subject.field.type === 'Field' &&
    'field' in subject &&
    isSafePath(subject.field.name)
  ) {
    newSubject.getValue = new Function(
      'subject',
      createGetValueFunctionBody(subject.field.name),
    ) as (subject: unknown) => unknown;
  }

  if (
    newSubject.type === 'ParenthesizedExpression' &&
    subject.type === 'ParenthesizedExpression'
  ) {
    newSubject.expression = hydrateAst(subject.expression);
  } else if (
    newSubject.type === 'Tag' &&
    subject.type === 'Tag' &&
    subject.expression?.type === 'ParenthesizedExpression'
  ) {
    newSubject.expression = hydrateAst(
      subject.expression,
    ) as ParenthesizedExpressionToken;
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
