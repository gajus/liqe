// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

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
      type: 'Condition',
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

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "main", "symbols": ["expr"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return d[0].length;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return d[0].length;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": (d) => d.join('')},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "expr", "symbols": ["two_op_expr"], "postprocess": id},
    {"name": "two_op_expr", "symbols": ["pre_two_op_expr", "operator", "post_one_op_expr"], "postprocess":  (data) => ({
          type: 'ConditionGroup',
          operator: data[1],
          left: data[0],
          right: data[2]
        }) },
    {"name": "two_op_expr", "symbols": ["pre_two_op_implicit_expr", {"literal":" "}, "post_one_op_implicit_expr"], "postprocess":  (data) => ({
          type: 'ConditionGroup',
          operator: {
            operator: 'AND',
            type: 'ImplicitOperator'
          },
          left: data[0],
          right: data[2]
        }) },
    {"name": "two_op_expr", "symbols": ["one_op_expr"], "postprocess": d => d[0]},
    {"name": "pre_two_op_implicit_expr", "symbols": ["two_op_expr"], "postprocess": d => d[0]},
    {"name": "pre_two_op_implicit_expr", "symbols": [{"literal":"("}, "_", "two_op_expr", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "post_one_op_implicit_expr", "symbols": ["one_op_expr"], "postprocess": d => d[0]},
    {"name": "post_one_op_implicit_expr", "symbols": [{"literal":"("}, "_", "one_op_expr", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "pre_two_op_expr", "symbols": ["two_op_expr", "__"], "postprocess": d => d[0]},
    {"name": "pre_two_op_expr", "symbols": [{"literal":"("}, "_", "two_op_expr", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "one_op_expr", "symbols": [{"literal":"("}, "_", "two_op_expr", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "one_op_expr$string$1", "symbols": [{"literal":"N"}, {"literal":"O"}, {"literal":"T"}], "postprocess": (d) => d.join('')},
    {"name": "one_op_expr", "symbols": ["one_op_expr$string$1", "post_boolean_primary"], "postprocess": notOp},
    {"name": "one_op_expr", "symbols": ["boolean_primary"], "postprocess": d => d[0]},
    {"name": "post_one_op_expr", "symbols": ["__", "one_op_expr"], "postprocess": d => d[1]},
    {"name": "post_one_op_expr", "symbols": [{"literal":"("}, "_", "one_op_expr", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "operator$string$1", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "operator", "symbols": ["operator$string$1"], "postprocess": (data, location) => ({location, operator: 'OR', type: 'Operator'})},
    {"name": "operator$string$2", "symbols": [{"literal":"A"}, {"literal":"N"}, {"literal":"D"}], "postprocess": (d) => d.join('')},
    {"name": "operator", "symbols": ["operator$string$2"], "postprocess": (data, location) => ({location, operator: 'AND', type: 'Operator'})},
    {"name": "boolean_primary", "symbols": ["side"], "postprocess": id},
    {"name": "post_boolean_primary", "symbols": [{"literal":"("}, "_", "boolean_primary", "_", {"literal":")"}], "postprocess": d => ({type: 'ParenthesizedExpression', expression: d[2]})},
    {"name": "post_boolean_primary", "symbols": ["__", "boolean_primary"], "postprocess": d => d[1]},
    {"name": "side", "symbols": ["field", {"literal":":"}, "_", "query"], "postprocess":  (data) => {
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
        } },
    {"name": "side", "symbols": ["query"], "postprocess": d => ({field: {name: '<implicit>'}, ...d[0]})},
    {"name": "field$ebnf$1", "symbols": []},
    {"name": "field$ebnf$1", "symbols": ["field$ebnf$1", /[a-zA-Z\d_$.]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "field", "symbols": [/[_a-zA-Z$]/, "field$ebnf$1"], "postprocess": (data, location) => ({type: 'LiteralExpression', name: data[0] + data[1].join(''), quoted: false, location})},
    {"name": "field", "symbols": ["sqstring"], "postprocess": (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'single', location})},
    {"name": "field", "symbols": ["dqstring"], "postprocess": (data, location) => ({type: 'LiteralExpression', name: data[0], quoted: true, quotes: 'double', location})},
    {"name": "query", "symbols": ["relational_operator", "_", "decimal"], "postprocess": (data, location) => {return {expression: {location: location + data[1] + 1, type: 'LiteralExpression', quoted: false, value: data[2]}, type: 'Condition', relationalOperator: data[0][0]}}},
    {"name": "query", "symbols": ["decimal"], "postprocess": (data, location) => ({type: 'Condition', expression: {location, type: 'LiteralExpression', quoted: false, value: data.join('')}})},
    {"name": "query", "symbols": ["regex"], "postprocess": (data, location) => ({type: 'Condition', expression: {location, type: 'RegexExpression', value: data.join('')}})},
    {"name": "query", "symbols": ["range"], "postprocess": (data) => data[0]},
    {"name": "query", "symbols": ["unquoted_value"], "postprocess":  (data, location, reject) => {
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
            type: 'Condition',
            expression: {
              location,
              type: 'LiteralExpression',
              quoted: false,
              value: normalizedValue
            },
          };
        } },
    {"name": "query", "symbols": ["sqstring"], "postprocess": (data, location) => ({type: 'Condition', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'single', value: data.join('')}})},
    {"name": "query", "symbols": ["dqstring"], "postprocess": (data, location) => ({type: 'Condition', expression: {location, type: 'LiteralExpression', quoted: true, quotes: 'double', value: data.join('')}})},
    {"name": "range$string$1", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"["}, "_", "decimal", "_", "range$string$1", "_", "decimal", "_", {"literal":"]"}], "postprocess": range(true, true)},
    {"name": "range$string$2", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"{"}, "_", "decimal", "_", "range$string$2", "_", "decimal", "_", {"literal":"]"}], "postprocess": range(false, true)},
    {"name": "range$string$3", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"["}, "_", "decimal", "_", "range$string$3", "_", "decimal", "_", {"literal":"}"}], "postprocess": range(true, false)},
    {"name": "range$string$4", "symbols": [{"literal":"T"}, {"literal":"O"}], "postprocess": (d) => d.join('')},
    {"name": "range", "symbols": [{"literal":"{"}, "_", "decimal", "_", "range$string$4", "_", "decimal", "_", {"literal":"}"}], "postprocess": range(false, false)},
    {"name": "relational_operator", "symbols": [{"literal":"="}]},
    {"name": "relational_operator", "symbols": [{"literal":">"}]},
    {"name": "relational_operator", "symbols": [{"literal":"<"}]},
    {"name": "relational_operator$string$1", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "relational_operator", "symbols": ["relational_operator$string$1"]},
    {"name": "relational_operator$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "relational_operator", "symbols": ["relational_operator$string$2"]},
    {"name": "regex", "symbols": ["regex_body", "regex_flags"], "postprocess": d => d.join('')},
    {"name": "regex_body$ebnf$1", "symbols": []},
    {"name": "regex_body$ebnf$1", "symbols": ["regex_body$ebnf$1", "regex_body_char"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "regex_body", "symbols": [{"literal":"/"}, "regex_body$ebnf$1", {"literal":"/"}], "postprocess": d => '/' + d[1].join('') + '/'},
    {"name": "regex_body_char", "symbols": [/[^\\]/], "postprocess": id},
    {"name": "regex_body_char", "symbols": [{"literal":"\\"}, /[^\\]/], "postprocess": d => '\\' + d[1]},
    {"name": "regex_flags", "symbols": []},
    {"name": "regex_flags$ebnf$1", "symbols": [/[gmiyusd]/]},
    {"name": "regex_flags$ebnf$1", "symbols": ["regex_flags$ebnf$1", /[gmiyusd]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "regex_flags", "symbols": ["regex_flags$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "unquoted_value$ebnf$1", "symbols": [/[a-zA-Z\-_*]/]},
    {"name": "unquoted_value$ebnf$1", "symbols": ["unquoted_value$ebnf$1", /[a-zA-Z\-_*]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unquoted_value", "symbols": ["unquoted_value$ebnf$1"], "postprocess": d => d[0].join('')}
  ],
  ParserStart: "main",
};

export default grammar;
