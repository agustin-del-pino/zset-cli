"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commands = "\nZSet-Lang CLI Help Documentation\n\nzset <command> [args]\n\nCommand List:\n\n- help [command-name]\n    Shows the help documentation of the given command.\n\n- repl\n    Runs the REPL of ZSet-Lang.\n\n- run [filepath]\n    Runs the given '*.zs' source file.\n\n";
var help = "\nZSet-Lang CLI Help Documentation\n\nzset help [command-name]\n\n    Shows the help documentation of the given command.\n\n";
var repl = "\nZSet-Lang CLI Help Documentation\n\nzset repl\n\n    Runs the REPL of ZSet-Lang which allows to evaluate a line of ZSet on console.\n    The result of every line is show once enter key is pressed.\n    To exit from REPL, type: \"exit\" (without the quotes), then press enter.\n\n";
var run = "\nZSet-Lang CLI Help Documentation\n\nzset run [filepath]\n\n    Runs the given '*.zs' source file.\n    In case the given filepath isn't a *.zs like file, it will throw an error.\n    Whenever an error occurs at executing the given source file, the error will be prompted.\n\n";
exports.default = {
    commands: commands,
    help: help,
    repl: repl,
    run: run
};
//# sourceMappingURL=help.js.map