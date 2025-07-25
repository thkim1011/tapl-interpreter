grammar LambdaCalculus;

prog: term EOF ;
term: 'lambda' ID term
    | '(' term ')'
    | ID
    | term term
    ;
ID: [a-zA-Z_][a-zA-Z_0-9]*;
WS: [ \t\n\r\f]+ -> skip;