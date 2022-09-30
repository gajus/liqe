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
      location,
      type: 'TagExpression',
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
      type: 'LogicalExpression',
      operator: data[1],
      left: data[0],
      right: data[2]
    }) %}
  | pre_two_op_implicit_expr " " post_one_op_implicit_expr {% (data) => ({
      type: 'LogicalExpression',
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
  | parentheses_open _ two_op_expr _ parentheses_close {% d => ({location: {open: d[0].location, close: d[4].location, }, type: 'ParenthesizedExpression', expression: d[2]}) %}

post_one_op_implicit_expr ->
    one_op_expr {% d => d[0] %}
  | parentheses_open _ one_op_expr _ parentheses_close {% d => ({location: {open: d[0].location, close: d[4].location, },type: 'ParenthesizedExpression', expression: d[2]}) %}

pre_two_op_expr ->
    two_op_expr __ {% d => d[0] %}
  | parentheses_open _ two_op_expr _ parentheses_close {% d => ({location: {open: d[0].location, close: d[4].location, },type: 'ParenthesizedExpression', expression: d[2]}) %}

one_op_expr ->
    parentheses_open _ two_op_expr _ parentheses_close {% d => ({location: {open: d[0].location, close: d[4].location, },type: 'ParenthesizedExpression', expression: d[2]}) %}
	|	"NOT" post_boolean_primary {% notOp %}
  | boolean_primary {% d => d[0] %}

post_one_op_expr ->
    __ one_op_expr {% d => d[1] %}
  | parentheses_open _ one_op_expr _ parentheses_close {% d => ({location: {open: d[0].location, close: d[4].location, },type: 'ParenthesizedExpression', expression: d[2]}) %}

parentheses_open ->
  "(" {% (data, location) => ({location}) %}

parentheses_close ->
  ")" {% (data, location) => ({location}) %}

operator ->
    "OR" {% (data, location) => ({location, operator: 'OR', type: 'Operator'}) %}
  | "AND" {% (data, location) => ({location, operator: 'AND', type: 'Operator'}) %}

boolean_primary ->
  side {% id %}

post_boolean_primary ->
    __ "(" _ two_op_expr _ ")" {% d => ({type: 'ParenthesizedExpression', expression: d[3]}) %}
  | __ boolean_primary {% d => d[1] %}

side ->
    field relational_operator _ query {% (data, location) => {
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
      location,
      field,
      relationalOperator: data[1],
      ...data[3]
    }
  } %}
  | query {% (data, location) => ({location, field: {type: 'ImplicitField'}, ...data[0]}) %}

field ->
    [_a-zA-Z$] [a-zA-Z\d_$.]:* {% (data, location) => ({type: 'LiteralExpression', name: data[0] + data[1].join(''), quoted: false, location}) %}
  | sqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'single', location}) %}
  | dqstring {% (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'double', location}) %}

query ->
    decimal {% (data, location) => ({type: 'TagExpression', expression: {location, type: 'LiteralExpression', quoted: false, value: Number(data.join(''))}}) %}
  | regex {% (data, location) => ({location, type: 'TagExpression', expression: {location, type: 'RegexExpression', value: data.join('')}}) %}
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
      type: 'TagExpression',
      expression: {
        location,
        type: 'LiteralExpression',
        quoted: false,
        value: normalizedValue
      },
    };
  } %}
  | sqstring {% (data, location) => ({type: 'TagExpression', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'single', value: data.join('')}}) %}
  | dqstring {% (data, location) => ({type: 'TagExpression', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'double', value: data.join('')}}) %}

range ->
    "[" _ decimal _ "TO" _ decimal _ "]" {% range(true, true) %}
  | "{" _ decimal _ "TO" _ decimal _ "]" {% range(false, true) %}
  | "[" _ decimal _ "TO" _ decimal _ "}" {% range(true, false) %}
  | "{" _ decimal _ "TO" _ decimal _ "}" {% range(false, false) %}
  
relational_operator ->
    ":" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}
  | ":=" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}
  | ":>" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}
  | ":<" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}
  | ":>=" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}
  | ":<=" {% (data, location) => ({location, type: 'RelationalOperator', operator: data[0]}) %}

regex ->
  regex_body regex_flags {% d => d.join('') %}

regex_body ->
    "/" regex_body_char:* "/" {% (data) => '/' + data[1].join('') + '/' %}

regex_body_char ->
    [^\\] {% id %}
  | "\\" [^\\] {% d => '\\' + d[1] %}

regex_flags ->
  null |
  [gmiyusd]:+ {% d => d[0].join('') %}

unquoted_value ->
  [a-zA-Z\-_*]:+ {% d => d[0].join('') %}