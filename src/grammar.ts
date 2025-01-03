type Grammar = {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

type NearleyLexer = {
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
  next: () => NearleyToken | undefined;
  reset: (chunk: string, info: any) => void;
  save: () => any;
};

type NearleyRule = {
  name: string;
  postprocess?: (d: any[], loc: number, reject?: {}) => any;
  symbols: NearleySymbol[];
};

type NearleySymbol =
  | string
  | { literal: any }
  | { test: (token: any) => boolean };

type NearleyToken = {
  [key: string]: any;
  value: any;
};

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(d: any[]): any {
  return d[0];
}

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {
      name: 'main',
      postprocess: (data) => data[1],
      symbols: ['_', 'logical_expression', '_'],
    },
    { name: '_$ebnf$1', symbols: [] },
    {
      name: '_$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['_$ebnf$1', 'whitespace_character'],
    },
    { name: '_', postprocess: (data) => data[0].length, symbols: ['_$ebnf$1'] },
    { name: '__$ebnf$1', symbols: ['whitespace_character'] },
    {
      name: '__$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['__$ebnf$1', 'whitespace_character'],
    },
    {
      name: '__',
      postprocess: (data) => data[0].length,
      symbols: ['__$ebnf$1'],
    },
    { name: 'whitespace_character', postprocess: id, symbols: [/[\t\n\v\f ]/] },
    { name: 'decimal$ebnf$1', postprocess: id, symbols: [{ literal: '-' }] },
    { name: 'decimal$ebnf$1', postprocess: () => null, symbols: [] },
    { name: 'decimal$ebnf$2', symbols: [/\d/] },
    {
      name: 'decimal$ebnf$2',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['decimal$ebnf$2', /\d/],
    },
    { name: 'decimal$ebnf$3$subexpression$1$ebnf$1', symbols: [/\d/] },
    {
      name: 'decimal$ebnf$3$subexpression$1$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['decimal$ebnf$3$subexpression$1$ebnf$1', /\d/],
    },
    {
      name: 'decimal$ebnf$3$subexpression$1',
      symbols: [{ literal: '.' }, 'decimal$ebnf$3$subexpression$1$ebnf$1'],
    },
    {
      name: 'decimal$ebnf$3',
      postprocess: id,
      symbols: ['decimal$ebnf$3$subexpression$1'],
    },
    { name: 'decimal$ebnf$3', postprocess: () => null, symbols: [] },
    {
      name: 'decimal',
      postprocess: (data) =>
        Number.parseFloat(
          (data[0] || '') +
            data[1].join('') +
            (data[2] ? '.' + data[2][1].join('') : ''),
        ),
      symbols: ['decimal$ebnf$1', 'decimal$ebnf$2', 'decimal$ebnf$3'],
    },
    { name: 'dqstring$ebnf$1', symbols: [] },
    {
      name: 'dqstring$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['dqstring$ebnf$1', 'dstrchar'],
    },
    {
      name: 'dqstring',
      postprocess: (data) => data[1].join(''),
      symbols: [{ literal: '"' }, 'dqstring$ebnf$1', { literal: '"' }],
    },
    { name: 'sqstring$ebnf$1', symbols: [] },
    {
      name: 'sqstring$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['sqstring$ebnf$1', 'sstrchar'],
    },
    {
      name: 'sqstring',
      postprocess: (data) => data[1].join(''),
      symbols: [{ literal: "'" }, 'sqstring$ebnf$1', { literal: "'" }],
    },
    { name: 'dstrchar', postprocess: id, symbols: [/[^\n"\\]/] },
    {
      name: 'dstrchar',
      postprocess: (data) => JSON.parse('"' + data.join('') + '"'),
      symbols: [{ literal: '\\' }, 'strescape'],
    },
    { name: 'sstrchar', postprocess: id, symbols: [/[^\n'\\]/] },
    {
      name: 'sstrchar',
      postprocess: (data) => JSON.parse('"' + data.join('') + '"'),
      symbols: [{ literal: '\\' }, 'strescape'],
    },
    {
      name: 'sstrchar$string$1',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: '\\' }, { literal: "'" }],
    },
    {
      name: 'sstrchar',
      postprocess: () => "'",
      symbols: ['sstrchar$string$1'],
    },
    { name: 'strescape', postprocess: id, symbols: [/["/\\bfnrt]/] },
    {
      name: 'strescape',
      postprocess: (data) => data.join(''),
      symbols: [
        { literal: 'u' },
        /[\dA-Fa-f]/,
        /[\dA-Fa-f]/,
        /[\dA-Fa-f]/,
        /[\dA-Fa-f]/,
      ],
    },
    {
      name: 'logical_expression',
      postprocess: id,
      symbols: ['two_op_logical_expression'],
    },
    {
      name: 'two_op_logical_expression',
      postprocess: (data) => ({
        left: data[0],
        location: {
          end: data[2].location.end,
          start: data[0].location.start,
        },
        operator: data[1],
        right: data[2],
        type: 'LogicalExpression',
      }),
      symbols: [
        'pre_two_op_logical_expression',
        'boolean_operator',
        'post_one_op_logical_expression',
      ],
    },
    {
      name: 'two_op_logical_expression',
      postprocess: (data) => ({
        left: data[0],
        location: {
          end: data[2].location.end,
          start: data[0].location.start,
        },
        operator: {
          operator: 'AND',
          type: 'ImplicitBooleanOperator',
        },
        right: data[2],
        type: 'LogicalExpression',
      }),
      symbols: [
        'pre_two_op_implicit_logical_expression',
        '__',
        'post_one_op_implicit_logical_expression',
      ],
    },
    {
      name: 'two_op_logical_expression',
      postprocess: (d) => d[0],
      symbols: ['one_op_logical_expression'],
    },
    {
      name: 'pre_two_op_implicit_logical_expression',
      postprocess: (d) => d[0],
      symbols: ['two_op_logical_expression'],
    },
    {
      name: 'pre_two_op_implicit_logical_expression',
      postprocess: (d) => ({
        expression: d[2],
        location: { end: d[4].location.start + 1, start: d[0].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        'parentheses_open',
        '_',
        'two_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'post_one_op_implicit_logical_expression',
      postprocess: (d) => d[0],
      symbols: ['one_op_logical_expression'],
    },
    {
      name: 'post_one_op_implicit_logical_expression',
      postprocess: (d) => ({
        expression: d[2],
        location: { end: d[4].location.start + 1, start: d[0].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        'parentheses_open',
        '_',
        'one_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'pre_two_op_logical_expression',
      postprocess: (d) => d[0],
      symbols: ['two_op_logical_expression', '__'],
    },
    {
      name: 'pre_two_op_logical_expression',
      postprocess: (d) => ({
        expression: d[2],
        location: { end: d[4].location.start + 1, start: d[0].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        'parentheses_open',
        '_',
        'two_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'one_op_logical_expression',
      postprocess: (d) => ({
        expression: {
          location: {
            end: d[0].location.start + 1,
            start: d[0].location.start + 1,
          },
          type: 'EmptyExpression',
        },
        location: { end: d[2].location.start + 1, start: d[0].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: ['parentheses_open', '_', 'parentheses_close'],
    },
    {
      name: 'one_op_logical_expression',
      postprocess: (d) => ({
        expression: d[2],
        location: { end: d[4].location.start + 1, start: d[0].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        'parentheses_open',
        '_',
        'two_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'one_op_logical_expression$string$1',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: 'N' }, { literal: 'O' }, { literal: 'T' }],
    },
    {
      name: 'one_op_logical_expression',
      postprocess: (data, start) => {
        return {
          location: {
            end: data[1].location.end,
            start,
          },
          operand: data[1],
          operator: 'NOT',
          type: 'UnaryOperator',
        };
      },
      symbols: ['one_op_logical_expression$string$1', 'post_boolean_primary'],
    },
    {
      name: 'one_op_logical_expression',
      postprocess: (data, start) => {
        return {
          location: {
            end: data[1].location.end,
            start,
          },
          operand: data[1],
          operator: '-',
          type: 'UnaryOperator',
        };
      },
      symbols: [{ literal: '-' }, 'boolean_primary'],
    },
    {
      name: 'one_op_logical_expression',
      postprocess: (d) => d[0],
      symbols: ['boolean_primary'],
    },
    {
      name: 'post_one_op_logical_expression',
      postprocess: (d) => d[1],
      symbols: ['__', 'one_op_logical_expression'],
    },
    {
      name: 'post_one_op_logical_expression',
      postprocess: (d) => ({
        expression: d[2],
        location: { end: d[4].location + 1, start: d[0].location },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        'parentheses_open',
        '_',
        'one_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'parentheses_open',
      postprocess: (data, start) => ({ location: { start } }),
      symbols: [{ literal: '(' }],
    },
    {
      name: 'parentheses_close',
      postprocess: (data, start) => ({ location: { start } }),
      symbols: [{ literal: ')' }],
    },
    {
      name: 'boolean_operator$string$1',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: 'O' }, { literal: 'R' }],
    },
    {
      name: 'boolean_operator',
      postprocess: (data, start) => ({
        location: { end: start + 2, start },
        operator: 'OR',
        type: 'BooleanOperator',
      }),
      symbols: ['boolean_operator$string$1'],
    },
    {
      name: 'boolean_operator$string$2',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: 'A' }, { literal: 'N' }, { literal: 'D' }],
    },
    {
      name: 'boolean_operator',
      postprocess: (data, start) => ({
        location: { end: start + 3, start },
        operator: 'AND',
        type: 'BooleanOperator',
      }),
      symbols: ['boolean_operator$string$2'],
    },
    { name: 'boolean_primary', postprocess: id, symbols: ['tag_expression'] },
    {
      name: 'post_boolean_primary',
      postprocess: (d) => ({
        expression: d[3],
        location: { end: d[5].location.start + 1, start: d[1].location.start },
        type: 'ParenthesizedExpression',
      }),
      symbols: [
        '__',
        'parentheses_open',
        '_',
        'two_op_logical_expression',
        '_',
        'parentheses_close',
      ],
    },
    {
      name: 'post_boolean_primary',
      postprocess: (d) => d[1],
      symbols: ['__', 'boolean_primary'],
    },
    {
      name: 'tag_expression',
      postprocess: (data, start) => {
        const field = {
          location: data[0].location,
          name: data[0].name,
          path: data[0].name.split('.').filter(Boolean),
          quoted: data[0].quoted,
          quotes: data[0].quotes,
          type: 'Field',
        };

        if (!data[0].quotes) {
          delete field.quotes;
        }

        return {
          field,
          location: {
            end: data[2].expression.location.end,
            start,
          },
          operator: data[1],
          ...data[2],
        };
      },
      symbols: ['field', 'comparison_operator', 'expression'],
    },
    {
      name: 'tag_expression',
      postprocess: (data, start) => {
        const field = {
          location: data[0].location,
          name: data[0].name,
          path: data[0].name.split('.').filter(Boolean),
          quoted: data[0].quoted,
          quotes: data[0].quotes,
          type: 'Field',
        };

        if (!data[0].quotes) {
          delete field.quotes;
        }

        return {
          expression: {
            location: {
              end: data[1].location.end,
              start: data[1].location.end,
            },
            type: 'EmptyExpression',
          },
          field,
          location: {
            end: data[1].location.end,
            start,
          },
          operator: data[1],
          type: 'Tag',
        };
      },
      symbols: ['field', 'comparison_operator'],
    },
    {
      name: 'tag_expression',
      postprocess: (data, start) => {
        return {
          field: { type: 'ImplicitField' },
          location: { end: data[0].expression.location.end, start },
          ...data[0],
        };
      },
      symbols: ['expression'],
    },
    { name: 'field$ebnf$1', symbols: [] },
    {
      name: 'field$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['field$ebnf$1', /[\w$.]/],
    },
    {
      name: 'field',
      postprocess: (data, start) => ({
        location: { end: start + (data[0] + data[1].join('')).length, start },
        name: data[0] + data[1].join(''),
        quoted: false,
        type: 'LiteralExpression',
      }),
      symbols: [/[$A-Z_a-z]/, 'field$ebnf$1'],
    },
    {
      name: 'field',
      postprocess: (data, start) => ({
        location: { end: start + data[0].length + 2, start },
        name: data[0],
        quoted: true,
        quotes: 'single',
        type: 'LiteralExpression',
      }),
      symbols: ['sqstring'],
    },
    {
      name: 'field',
      postprocess: (data, start) => ({
        location: { end: start + data[0].length + 2, start },
        name: data[0],
        quoted: true,
        quotes: 'double',
        type: 'LiteralExpression',
      }),
      symbols: ['dqstring'],
    },
    {
      name: 'expression',
      postprocess: (data, start) => ({
        expression: {
          location: { end: start + data.join('').length, start },
          quoted: false,
          type: 'LiteralExpression',
          value: Number(data.join('')),
        },
        type: 'Tag',
      }),
      symbols: ['decimal'],
    },
    {
      name: 'expression',
      postprocess: (data, start) => ({
        expression: {
          location: { end: start + data.join('').length, start },
          type: 'RegexExpression',
          value: data.join(''),
        },
        type: 'Tag',
      }),
      symbols: ['regex'],
    },
    { name: 'expression', postprocess: (data) => data[0], symbols: ['range'] },
    {
      name: 'expression',
      postprocess: (data, start, reject) => {
        const value = data.join('');

        if (data[0] === 'AND' || data[0] === 'OR' || data[0] === 'NOT') {
          return reject;
        }

        let normalizedValue;

        if (value === 'true') {
          normalizedValue = true;
        } else if (value === 'false') {
          normalizedValue = false;
        } else if (value === 'null') {
          normalizedValue = null;
        } else {
          normalizedValue = value;
        }

        return {
          expression: {
            location: {
              end: start + value.length,
              start,
            },
            quoted: false,
            type: 'LiteralExpression',
            value: normalizedValue,
          },
          type: 'Tag',
        };
      },
      symbols: ['unquoted_value'],
    },
    {
      name: 'expression',
      postprocess: (data, start) => ({
        expression: {
          location: { end: start + data.join('').length + 2, start },
          quoted: true,
          quotes: 'single',
          type: 'LiteralExpression',
          value: data.join(''),
        },
        type: 'Tag',
      }),
      symbols: ['sqstring'],
    },
    {
      name: 'expression',
      postprocess: (data, start) => ({
        expression: {
          location: { end: start + data.join('').length + 2, start },
          quoted: true,
          quotes: 'double',
          type: 'LiteralExpression',
          value: data.join(''),
        },
        type: 'Tag',
      }),
      symbols: ['dqstring'],
    },
    {
      name: 'range$string$1',
      postprocess: (d) => d.join(''),
      symbols: [
        { literal: ' ' },
        { literal: 'T' },
        { literal: 'O' },
        { literal: ' ' },
      ],
    },
    {
      name: 'range',
      postprocess: (data, start) => {
        return {
          expression: {
            location: {
              end: data[4].location.start + 1,
              start: data[0].location.start,
            },
            range: {
              max: data[3],
              maxInclusive: data[4].inclusive,
              min: data[1],
              minInclusive: data[0].inclusive,
            },
            type: 'RangeExpression',
          },
          location: {
            start,
          },
          type: 'Tag',
        };
      },
      symbols: [
        'range_open',
        'decimal',
        'range$string$1',
        'decimal',
        'range_close',
      ],
    },
    {
      name: 'range_open',
      postprocess: (data, start) => ({ inclusive: true, location: { start } }),
      symbols: [{ literal: '[' }],
    },
    {
      name: 'range_open',
      postprocess: (data, start) => ({ inclusive: false, location: { start } }),
      symbols: [{ literal: '{' }],
    },
    {
      name: 'range_close',
      postprocess: (data, start) => ({ inclusive: true, location: { start } }),
      symbols: [{ literal: ']' }],
    },
    {
      name: 'range_close',
      postprocess: (data, start) => ({ inclusive: false, location: { start } }),
      symbols: [{ literal: '}' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: [{ literal: ':' }],
    },
    {
      name: 'comparison_operator$subexpression$1$string$1',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: ':' }, { literal: '=' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: ['comparison_operator$subexpression$1$string$1'],
    },
    {
      name: 'comparison_operator$subexpression$1$string$2',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: ':' }, { literal: '>' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: ['comparison_operator$subexpression$1$string$2'],
    },
    {
      name: 'comparison_operator$subexpression$1$string$3',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: ':' }, { literal: '<' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: ['comparison_operator$subexpression$1$string$3'],
    },
    {
      name: 'comparison_operator$subexpression$1$string$4',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: ':' }, { literal: '>' }, { literal: '=' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: ['comparison_operator$subexpression$1$string$4'],
    },
    {
      name: 'comparison_operator$subexpression$1$string$5',
      postprocess: (d) => d.join(''),
      symbols: [{ literal: ':' }, { literal: '<' }, { literal: '=' }],
    },
    {
      name: 'comparison_operator$subexpression$1',
      symbols: ['comparison_operator$subexpression$1$string$5'],
    },
    {
      name: 'comparison_operator',
      postprocess: (data, start) => ({
        location: { end: start + data[0][0].length, start },
        operator: data[0][0],
        type: 'ComparisonOperator',
      }),
      symbols: ['comparison_operator$subexpression$1'],
    },
    {
      name: 'regex',
      postprocess: (d) => d.join(''),
      symbols: ['regex_body', 'regex_flags'],
    },
    { name: 'regex_body$ebnf$1', symbols: [] },
    {
      name: 'regex_body$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['regex_body$ebnf$1', 'regex_body_char'],
    },
    {
      name: 'regex_body',
      postprocess: (data) => '/' + data[1].join('') + '/',
      symbols: [{ literal: '/' }, 'regex_body$ebnf$1', { literal: '/' }],
    },
    { name: 'regex_body_char', postprocess: id, symbols: [/[^\\]/] },
    {
      name: 'regex_body_char',
      postprocess: (d) => '\\' + d[1],
      symbols: [{ literal: '\\' }, /[^\\]/],
    },
    { name: 'regex_flags', symbols: [] },
    { name: 'regex_flags$ebnf$1', symbols: [/[dgimsuy]/] },
    {
      name: 'regex_flags$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['regex_flags$ebnf$1', /[dgimsuy]/],
    },
    {
      name: 'regex_flags',
      postprocess: (d) => d[0].join(''),
      symbols: ['regex_flags$ebnf$1'],
    },
    { name: 'unquoted_value$ebnf$1', symbols: [] },
    {
      name: 'unquoted_value$ebnf$1',
      postprocess: (d) => d[0].concat([d[1]]),
      symbols: ['unquoted_value$ebnf$1', /[\w#$*.?@-]/],
    },
    {
      name: 'unquoted_value',
      postprocess: (d) => d[0] + d[1].join(''),
      symbols: [/[#$*?@A-Z_a-z]/, 'unquoted_value$ebnf$1'],
    },
  ],
  ParserStart: 'main',
};

export default grammar;
