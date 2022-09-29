@preprocessor typescript
@builtin "whitespace.ne"
@builtin "string.ne"
@builtin "number.ne"

main -> expr {% id %}

@{%
const opExpr = (operator) => {
  return d => ({
    type: 'ConditionGroup',
    operator: operator,
    left: d[0],
    right: d[2]
  });
}

const notOp = (d) => {
  return {
    operator: 'NOT',
    operand: d[1]
  };
}

const range = ( minInclusive, maxInclusive) => {
  return (d) => {
    return {
      type: 'Condition',
      expression: {
        type: 'RangeExpression',
        range: {
          min: d[2],
          minInclusive,
          maxInclusive,
          max: d[6],
        }
      }
    }
  };
}
%}

# Adapted from js-sql-parser
# https://github.com/justinkenel/js-sql-parse/blob/aaecf0fb0a4e700c4df07d987cf0c54a8276553b/sql.ne
expr -> two_op_expr {% id %}

two_op_expr ->
    pre_two_op_expr "OR" post_one_op_expr {% opExpr('OR') %}
  | pre_two_op_expr "AND" post_one_op_expr {% opExpr('AND') %}
	| one_op_expr {% d => d[0] %}

pre_two_op_expr ->
    two_op_expr __ {% d => d[0] %}
  | "(" _ two_op_expr _ ")" {% d => d[2] %}

one_op_expr ->
    "(" _ two_op_expr _ ")" {% d => d[2] %}
	|	"NOT" post_boolean_primary {% notOp %}
  | boolean_primary {% d => d[0] %}

post_one_op_expr ->
    __ one_op_expr {% d => d[1] %}
  | "(" _ one_op_expr _ ")" {% d => d[2] %}

boolean_primary ->
  side {% id %}

post_boolean_primary ->
    "(" _ boolean_primary _ ")" {% d => d[2] %}
  | __ boolean_primary {% d => d[1] %}

side ->
    field ":" _ query {% (data) => {
    const field = {
      name: data[0].name,
      path: data[0].name.split('.').filter(Boolean),
      quoted: data[0].quoted,
      quotes: data[0].quotes,
      location: data[0].location,
    };

    if (!data[0].quotes) {
      delete field.quotes;
    }

    return {
      field,
      ...data[3]
    }
  } %}
  | query {% d => ({field: {name: '<implicit>'}, ...d[0]}) %}

field ->
    [_a-zA-Z$] [a-zA-Z\d_$.]:* {% (data, location) => ({type: 'LiteralExpression', name: data[0] + data[1].join(''), quoted: false, location}) %}
  | sqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'single', location}) %}
  | dqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'double', location}) %}

query ->
    relational_operator _ decimal {% d => ({expression: {type: 'LiteralExpression', quoted: false, value: d[2]}, type: 'Condition', relationalOperator: d[0][0]}) %}
  | decimal {% d => ({type: 'Condition', expression: {type: 'LiteralExpression', quoted: false, value: d.join('')}}) %}
  | regex {% d => ({type: 'Condition', expression: {type: 'RegexExpression', value: d.join('')}}) %}
  | range {% d => d[0] %}
  | unquoted_value {% (data, location, reject) => {
    let value = data.join('');

    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (value === 'null') {
      value = null;
    }

    return {
      type: 'Condition',
      expression: {
        type: 'LiteralExpression',
        quoted: false,
        value
      },
    };
  } %}
  | sqstring {% d => ({type: 'Condition', expression: {type: 'LiteralExpression', quoted: true, quotes: 'single', value: d.join('')}}) %}
  | dqstring {% d => ({type: 'Condition', expression: {type: 'LiteralExpression', quoted: true, quotes: 'double', value: d.join('')}}) %}

range ->
    "[" _ decimal _ "TO" _ decimal _ "]" {% range(true, true) %}
  | "{" _ decimal _ "TO" _ decimal _ "]" {% range(false, true) %}
  | "[" _ decimal _ "TO" _ decimal _ "}" {% range(true, false) %}
  | "{" _ decimal _ "TO" _ decimal _ "}" {% range(false, false) %}
  
relational_operator ->
    "="
  | ">"
  | "<"
  | ">="
  | "<="

regex ->
  regex_body regex_flags {% d => d.join('') %}

regex_body ->
    "/" regex_body_char:* "/" {% d => '/' + d[1].join('') + '/' %}

regex_body_char ->
    [^\\] {% id %}
  | "\\" [^\\] {% d => '\\' + d[1] %}

regex_flags ->
  null |
  [gmiyusd]:+ {% d => d[0].join('') %}

unquoted_value ->
  [a-zA-Z\-_*]:+ {% d => d[0].join('') %}