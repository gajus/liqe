@preprocessor typescript

main -> expr {% id %}

# Whitespace: `_` is optional, `__` is mandatory.
_  -> wschar:* {% function(d) {return d[0].length;} %}
__ -> wschar:+ {% function(d) {return d[0].length;} %}

wschar -> [ \t\n\v\f] {% id %}

# Numbers
decimal -> "-":? [0-9]:+ ("." [0-9]:+):? {%
    function(d) {
        return parseFloat(
            (d[0] || "") +
            d[1].join("") +
            (d[2] ? "."+d[2][1].join("") : "")
        );
    }
%}

# Double-quoted string
dqstring -> "\"" dstrchar:* "\"" {% function(d) {return d[1].join(""); } %}
sqstring -> "'"  sstrchar:* "'"  {% function(d) {return d[1].join(""); } %}

dstrchar -> [^\\"\n] {% id %}
    | "\\" strescape {%
    function(d) {
        return JSON.parse("\""+d.join("")+"\"");
    }
%}

sstrchar -> [^\\'\n] {% id %}
    | "\\" strescape
        {% function(d) { return JSON.parse("\""+d.join("")+"\""); } %}
    | "\\'"
        {% function(d) {return "'"; } %}

strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
    function(d) {
        return d.join("");
    }
%}


@{%
const notOp = (d) => {
  return {
    type: 'Operand',
    operator: 'NOT',
    operand: d[1]
  };
}

const range = ( minInclusive, maxInclusive) => {
  return (data, location) => {
    return {
      type: 'LogicalExpression',
      expression: {
        location,
        type: 'RangeExpression',
        range: {
          min: data[2],
          minInclusive,
          maxInclusive,
          max: data[6],
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
    pre_two_op_expr operator post_one_op_expr {% (data) => ({
      type: 'LogicalExpressionGroup',
      operator: data[1],
      left: data[0],
      right: data[2]
    }) %}
  | pre_two_op_implicit_expr " " post_one_op_implicit_expr {% (data) => ({
      type: 'LogicalExpressionGroup',
      operator: {
        operator: 'AND',
        type: 'ImplicitOperator'
      },
      left: data[0],
      right: data[2]
    }) %}
	| one_op_expr {% d => d[0] %}

pre_two_op_implicit_expr ->
    two_op_expr {% d => d[0] %}
  | "(" _ two_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}

post_one_op_implicit_expr ->
    one_op_expr {% d => d[0] %}
  | "(" _ one_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}

pre_two_op_expr ->
    two_op_expr __ {% d => d[0] %}
  | "(" _ two_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}

one_op_expr ->
    "(" _ two_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}
	|	"NOT" post_boolean_primary {% notOp %}
  | boolean_primary {% d => d[0] %}

post_one_op_expr ->
    __ one_op_expr {% d => d[1] %}
  | "(" _ one_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}

operator ->
    "OR" {% (data, location) => ({location, operator: 'OR', type: 'Operator'}) %}
  | "AND" {% (data, location) => ({location, operator: 'AND', type: 'Operator'}) %}

boolean_primary ->
  side {% id %}

post_boolean_primary ->
    "(" _ boolean_primary _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[2]}) %}
  | __ boolean_primary {% d => d[1] %}

side ->
    field ":" _ query {% (data) => {
    const field = {
      type: 'Field',
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
  | query {% d => ({field: {type: 'ImplicitField'}, ...d[0]}) %}

field ->
    [_a-zA-Z$] [a-zA-Z\d_$.]:* {% (data, location) => ({type: 'LiteralExpression', name: data[0] + data[1].join(''), quoted: false, location}) %}
  | sqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'single', location}) %}
  | dqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'double', location}) %}

query ->
    relational_operator _ decimal {% (data, location) => {return {expression: {location: location + data[1] + 1, type: 'LiteralExpression', quoted: false, value: data[2]}, type: 'LogicalExpression', relationalOperator: data[0][0]}} %}
  | decimal {% (data, location) => ({type: 'LogicalExpression', expression: {location, type: 'LiteralExpression', quoted: false, value: data.join('')}}) %}
  | regex {% (data, location) => ({type: 'LogicalExpression', expression: {location, type: 'RegexExpression', value: data.join('')}}) %}
  | range {% (data) => data[0] %}
  | unquoted_value {% (data, location, reject) => {
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
      type: 'LogicalExpression',
      expression: {
        location,
        type: 'LiteralExpression',
        quoted: false,
        value: normalizedValue
      },
    };
  } %}
  | sqstring {% (data, location) => ({type: 'LogicalExpression', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'single', value: data.join('')}}) %}
  | dqstring {% (data, location) => ({type: 'LogicalExpression', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'double', value: data.join('')}}) %}

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