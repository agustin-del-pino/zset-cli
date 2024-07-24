const commands = 
`
ZSet-Lang CLI Help Documentation

zset <command> [args]

Command List:

- help [command-name]
    Shows the help documentation of the given command.

- repl
    Runs the REPL of ZSet-Lang.

- run [filepath]
    Runs the given '*.zs' source file.

`

const help = 
`
ZSet-Lang CLI Help Documentation

zset help [command-name]

    Shows the help documentation of the given command.

`

const repl = 
`
ZSet-Lang CLI Help Documentation

zset repl

    Runs the REPL of ZSet-Lang which allows to evaluate a line of ZSet on console.
    The result of every line is show once enter key is pressed.
    To exit from REPL, type: "exit" (without the quotes), then press enter.

`

const run = 
`
ZSet-Lang CLI Help Documentation

zset run [filepath]

    Runs the given '*.zs' source file.
    In case the given filepath isn't a *.zs like file, it will throw an error.
    Whenever an error occurs at executing the given source file, the error will be prompted.

`

export default {
    commands,
    help,
    repl,
    run
}