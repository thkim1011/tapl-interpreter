grammar LambdaCalculus;

prog: term EOF ;
term: abstraction
    | application
    | atom
    ;

abstraction: 'lambda' ID '.' term;

// Left-associative application: x y z parses as ((x y) z)
application: application atom # AppLeftRecursion
           | atom atom        # AppBaseCase
           ;

atom: variable
    | '(' term ')'
    ;

variable: ID;

ID: [a-zA-Z_][a-zA-Z_0-9]*;
WS: [ \t\n\r\f]+ -> skip;