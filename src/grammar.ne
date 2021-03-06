@preprocessor typescript
@builtin "whitespace.ne"
@builtin "string.ne"
@builtin "number.ne"

main -> expr {% id %}

@{%
const opExpr = (operator) => {
  return d => ({
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

const unquotedValue = (d, location, reject) => {
  let query = d.join('');

  if (query === 'true') {
    query = true;
  } else if (query === 'false') {
    query = false;
  } else if (query === 'null') {
    query = null;
  }

  return {
    quoted: false,
    query,
  };
}

const range = ( minInclusive, maxInclusive) => {
  return (d) => {
    return {
      range: {
        min: d[2],
        minInclusive,
        maxInclusive,
        max: d[6],
      }
    }
  };
}

const field = d => {
  return {
    field: d[0],
    fieldPath: d[0].split('.').filter(Boolean),
    ...d[3]
  }
};
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
    field ":" _ query {% field %}
  | query {% d => ({field: '<implicit>', ...d[0]}) %}

field ->
    [_a-zA-Z$] [a-zA-Z\d_$.]:* {% d => d[0] + d[1].join('') %}
  | sqstring {% id %}
  | dqstring {% id %}

query ->
    relational_operator _ decimal {% d => ({quoted: false, query: d[2], relationalOperator: d[0][0]}) %}
  | decimal {% d => ({quoted: false, query: d.join('')}) %}
  | regex {% d => ({quoted: false, regex: true, query: d.join('')}) %}
  | range {% id %}
  | unquoted_value {% unquotedValue %}
  | sqstring {% d => ({quoted: true, query: d.join('')}) %}
  | dqstring {% d => ({quoted: true, query: d.join('')}) %}

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