"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paper;
var builder_1 = require("./builder");
var zset_lang_1 = require("zset-lang");
var booleans = new Set().add(zset_lang_1.NodeType.FORALL);
function latexIdent(b, n) {
    switch (n.value) {
        case "true":
            b.write("\\bold{T}");
            return;
        case "false":
            b.write("\\bold{F}");
            return;
        case "empty":
            b.write("\\varnothing");
            return;
        case "infinity":
            b.write("\\infty");
            return;
        default:
            b.write(n.value);
    }
}
function latexNum(b, n) {
    b.write(n.value);
}
function latexParenthesis(b, n) {
    b.write("(").input(latex, n.expr).write(")");
}
function latexCongruenceClass(b, n) {
    b.write("\\overline{").input(latex, n.remainder).write("}");
}
function latexSet(b, n) {
    if (n.elements.length === 0) {
        b.write("\\varnothing");
        return;
    }
    b.write("\\{").input(latexCollection, n.elements).write("\\}");
}
function latexUnary(b, n) {
    switch (n.op) {
        case zset_lang_1.TokenType.SUB:
            b.write("".concat(n.value)).input(latex, n.expr);
            return;
        case zset_lang_1.TokenType.NOT:
            if (n.expr.type === zset_lang_1.NodeType.BINARY) {
                b.input(latexBinary, n.expr, true);
                return;
            }
            if (n.expr.type === zset_lang_1.NodeType.CONGRUENCE) {
                b.input(latexCongruence, n.expr, true);
            }
            b.write("\\neg ").input(latex, n.expr);
            return;
        case zset_lang_1.TokenType.CARDINAL:
            b.write("\\verb|#| ").input(latex, n.expr);
            return;
    }
}
function latexBinary(b, n, not) {
    if (not === void 0) { not = false; }
    b.input(latex, n.left);
    switch (n.op) {
        case zset_lang_1.TokenType.MOD:
            b.write(" \\bmod ").input(latex, n.right);
            return;
        case zset_lang_1.TokenType.POW:
            b.write("^{").input(latex, n.right).write("}");
            return;
        case zset_lang_1.TokenType.MUL:
            if (n.left === n.right) {
                b.write(" \\times ");
            }
            b.input(latex, n.right);
            return;
        case zset_lang_1.TokenType.IN:
            if (not) {
                b.write(" \\not");
            }
            b.write(" \\in ").input(latex, n.right);
            return;
        case zset_lang_1.TokenType.EQUAL:
            if (not) {
                b.write(" \\not");
            }
            if (booleans.has(n.left.type) || booleans.has(n.left.type) ||
                (n.left.type === zset_lang_1.NodeType.IDENT && ["true", "false"].includes(n.left.value)) ||
                (n.right.type === zset_lang_1.NodeType.IDENT && ["true", "false"].includes(n.right.value))) {
                b.write(" \\Leftrightarrow ");
            }
            else {
                b.write(" = ");
            }
            b.input(latex, n.right);
            return;
        default:
            b.write(n.value).input(latex, n.right);
            return;
    }
}
function latexAssign(b, n) {
    b.input(latex, n.name);
    if (booleans.has(n.assigned.type) ||
        (n.assigned.type === zset_lang_1.NodeType.IDENT && ["true", "false"].includes(n.assigned.value))) {
        b.write(" \\Leftrightarrow ");
    }
    else {
        b.write(" = ");
    }
    b.input(latex, n.assigned);
}
function latexCongruence(b, n, not) {
    if (not === void 0) { not = false; }
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
function latexCollection(b, n) {
    if (n.length === 0)
        return;
    b.input(latex, n[0]);
    for (var _i = 0, _a = n.slice(1); _i < _a.length; _i++) {
        var e = _a[_i];
        b.write(",").input(latex, e);
    }
}
function latexForall(b, n) {
    b.write("\\forall ")
        .input(latexIdent, n.iterator)
        .write(" \\in ")
        .input(latex, n.iterator)
        .write(" : ")
        .input(latex, n.verify);
}
function latexSource(b, n) {
    if (n.comments[-1] !== undefined) {
        b.line(n.comments[-1]);
    }
    b.line("$$");
    n.expressions.forEach(function (e, i) {
        b.input(latex, e);
        if (n.comments[i] !== undefined) {
            b.line("$$").newline()
                .line(n.comments[-1]);
            if (i !== n.expressions.length - 1) {
                b.line("$$").end();
            }
        }
        else if (i === n.expressions.length - 1) {
            b.line("$$").newline();
        }
        else {
            b.write("\\\\").end();
        }
    });
}
function latex(b, n) {
    switch (n.type) {
        case zset_lang_1.NodeType.SOURCE:
            latexSource(b, n);
            return;
        case zset_lang_1.NodeType.IDENT:
            latexIdent(b, n);
            return;
        case zset_lang_1.NodeType.NUM:
            latexNum(b, n);
            return;
        case zset_lang_1.NodeType.UNARY:
            latexUnary(b, n);
            return;
        case zset_lang_1.NodeType.BINARY:
            latexBinary(b, n);
            return;
        case zset_lang_1.NodeType.CONGRUENCE:
            latexCongruence(b, n);
            return;
        case zset_lang_1.NodeType.ASSIGMENT:
            latexAssign(b, n);
            return;
        case zset_lang_1.NodeType.PARENTHESIS:
            latexParenthesis(b, n);
            return;
        case zset_lang_1.NodeType.CONGRUENCE_CLASS:
            latexCongruenceClass(b, n);
            return;
        case zset_lang_1.NodeType.FORALL:
            latexForall(b, n);
            return;
        case zset_lang_1.NodeType.SET:
            latexSet(b, n);
            return;
    }
}
function paper(n) {
    var b = new builder_1.default();
    latex(b, n);
    return b.toString();
}
//# sourceMappingURL=paper.js.map