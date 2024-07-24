import StringBuilder from "./builder";
import {
    AssigmentNode,
    BinaryNode,
    CongruenceClassNode,
    CongruenceNode,
    ForAllNode,
    IdentNode,
    node,
    NodeType,
    NumNode,
    ParenthesisNode,
    SetNode,
    SourceNode,
    UnaryNode,
    TokenType
} from "zset-lang";

const booleans = new Set<NodeType>().add(NodeType.FORALL);

function latexIdent(b: StringBuilder, n: IdentNode) {
    switch (n.value) {
        case "true":
            b.write("\\bold{T}")
            return;
        case "false":
            b.write("\\bold{F}")
            return;
        case "empty":
            b.write(`\\varnothing`);
            return;
        case "infinity":
            b.write("\\infty")
            return;
        default:
            b.write(n.value);
    }
}

function latexNum(b: StringBuilder, n: NumNode) {
    b.write(n.value);
}

function latexParenthesis(b: StringBuilder, n: ParenthesisNode) {
    b.write("(").input(latex, n.expr).write(")");
}

function latexCongruenceClass(b: StringBuilder, n: CongruenceClassNode) {
    b.write(`\\overline{`).input(latex, n.remainder).write("}")
}

function latexSet(b: StringBuilder, n: SetNode) {
    if (n.elements.length === 0) {
        b.write(`\\varnothing`);
        return;
    }
    b.write(`\\{`).input(latexCollection, n.elements).write("\\}")
}

function latexUnary(b: StringBuilder, n: UnaryNode) {
    switch (n.op) {
        case TokenType.SUB:
            b.write(`${n.value}`).input(latex, n.expr);
            return;
        case TokenType.NOT:
            if (n.expr.type === NodeType.BINARY) {
                b.input(latexBinary, n.expr, true);
                return;
            }
            if (n.expr.type === NodeType.CONGRUENCE) {
                b.input(latexCongruence, n.expr, true);
            }
            b.write("\\neg ").input(latex, n.expr);
            return;
        case TokenType.CARDINAL:
            b.write("\\verb|#| ").input(latex, n.expr);
            return;
    }
}

function latexBinary(b: StringBuilder, n: BinaryNode, not: boolean = false) {
    b.input(latex, n.left);

    switch (n.op) {
        case TokenType.MOD:
            b.write(" \\bmod ").input(latex, n.right);
            return;
        case TokenType.POW:
            b.write("^{").input(latex, n.right).write("}");
            return;
        case TokenType.MUL:
            if (n.left === n.right) {
                b.write(" \\times ");
            }
            b.input(latex, n.right)
            return;
        case TokenType.IN:
            if (not) {
                b.write(" \\not")
            }
            b.write(" \\in ").input(latex, n.right);
            return;
        case TokenType.EQUAL:
            if (not) {
                b.write(" \\not");
            }
            if (booleans.has(n.left.type) || booleans.has(n.left.type) ||
                (n.left.type === NodeType.IDENT && ["true", "false"].includes(n.left.value)) ||
                (n.right.type === NodeType.IDENT && ["true", "false"].includes(n.right.value))
            ) {
                b.write(" \\Leftrightarrow ");
            } else {
                b.write(" = ");
            }
            b.input(latex, n.right);
            return;
        default:
            b.write(n.value).input(latex, n.right)
            return;
    }
}

function latexAssign(b: StringBuilder, n: AssigmentNode) {
    b.input(latex, n.name)

    if (booleans.has(n.assigned.type) ||
        (n.assigned.type === NodeType.IDENT && ["true", "false"].includes(n.assigned.value))
    ) {
        b.write(" \\Leftrightarrow ")
    } else {
        b.write(" = ")
    }

    b.input(latex, n.assigned);
}

function latexCongruence(b: StringBuilder, n: CongruenceNode, not: boolean = false) {
    b.input(latex, n.left);
    if (not) {
        b.write(" \\not");
    }
    b.write(" \\equiv ")
        .input(latex, n.right)
        .write(" \\pod{")
        .input(latex, n.mod.expr)
        .write("}");
}

function latexCollection(b: StringBuilder, n: node[]) {
    if (n.length === 0) return;
    b.input(latex, n[0]);
    for (const e of n.slice(1)) {
        b.write(",").input(latex, e);
    }
}

function latexForall(b: StringBuilder, n: ForAllNode) {
    b.write("\\forall ")
        .input(latexIdent, n.iterator)
        .write(" \\in ")
        .input(latex, n.iterator)
        .write(" : ")
        .input(latex, n.verify);
}

function latexSource(b: StringBuilder, n: SourceNode) {
    if (n.comments[-1] !== undefined) {
        b.line(n.comments[-1]);
    }
    b.line("$$");
    n.expressions.forEach((e, i) => {
        b.input(latex, e);
        if (n.comments[i] !== undefined) {
            b.line("$$").newline()
                .line(n.comments[-1]);

            if (i !== n.expressions.length - 1) {
                b.line("$$").end();
            }
        } else if (i === n.expressions.length - 1) {
            b.line("$$").newline();
        } else {
            b.write("\\\\").end();
        }
    });
}

function latex(b: StringBuilder, n: node) {
    switch (n.type) {
        case NodeType.SOURCE:
            latexSource(b, n as SourceNode);
            return;
        case NodeType.IDENT:
            latexIdent(b, n as IdentNode);
            return;
        case NodeType.NUM:
            latexNum(b, n as NumNode);
            return;
        case NodeType.UNARY:
            latexUnary(b, n as UnaryNode);
            return;
        case NodeType.BINARY:
            latexBinary(b, n as BinaryNode);
            return;
        case NodeType.CONGRUENCE:
            latexCongruence(b, n as CongruenceNode);
            return;
        case NodeType.ASSIGMENT:
            latexAssign(b, n as AssigmentNode);
            return;
        case NodeType.PARENTHESIS:
            latexParenthesis(b, n as ParenthesisNode);
            return;
        case NodeType.CONGRUENCE_CLASS:
            latexCongruenceClass(b, n as CongruenceClassNode);
            return;
        case NodeType.FORALL:
            latexForall(b, n as ForAllNode);
            return;
        case NodeType.SET:
            latexSet(b, n as SetNode);
            return;
    }
}

export default function paper(n: node): string {
    const b = new StringBuilder();
    latex(b, n);
    return b.toString();
}