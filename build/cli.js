"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var zset_lang_1 = require("zset-lang");
var readline = require("node:readline/promises");
var fs = require("node:fs/promises");
var paper_1 = require("./paper");
var help_1 = require("./help");
var CLI = /** @class */ (function () {
    function CLI(version) {
        this.commands = new Set(["help", "version", "repl", "run"]);
        this.versionNumber = version;
        this.zse = new zset_lang_1.ZSetEngine();
        this.parser = new zset_lang_1.Parser();
    }
    CLI.prototype.version = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.versionNumber];
            });
        });
    };
    CLI.prototype.help = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.commands.has(args[0])) {
                    return [2 /*return*/, help_1.default[args[0]]];
                }
                return [2 /*return*/, help_1.default.commands];
            });
        });
    };
    CLI.prototype.repl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rl, line, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                        });
                        console.log("ZSet-Lang ".concat(this.versionNumber, " REPL\n"));
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, rl.question(">> ")];
                    case 2:
                        line = _a.sent();
                        if (line === "exit") {
                            return [3 /*break*/, 3];
                        }
                        if (line === "clear") {
                            console.clear();
                            return [3 /*break*/, 1];
                        }
                        try {
                            ret = this.zse.eval(line);
                            if (ret.type !== zset_lang_1.ZSObjectType.NULL) {
                                console.log(ret.toString());
                            }
                        }
                        catch (e) {
                            console.error(e.message);
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        rl.close();
                        return [2 /*return*/, ""];
                }
            });
        });
    };
    CLI.prototype.paper = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var out, src, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        out = this.getFlag(args, ["--out", "-o"], "".concat(args[0].replace(".zs", ".md")));
                        if (out === "") {
                            throw new Error("missing --out flag value");
                        }
                        return [4 /*yield*/, fs.readFile("".concat(args[0]), 'utf8')];
                    case 1:
                        src = _a.sent();
                        try {
                            source = this.parser.parse(src);
                        }
                        catch (e) {
                            throw new Error("the ".concat(args[0], " could not be converted due: \n").concat(e.message));
                        }
                        return [4 /*yield*/, fs.writeFile(out, (0, paper_1.default)(source))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, ""];
                }
            });
        });
    };
    CLI.prototype.getFlag = function (args, flags, def) {
        for (var i = 0; i < args.length; i++) {
            if (flags.includes(args[i])) {
                return args[i + 1] || "";
            }
        }
        return def;
    };
    CLI.prototype.run = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var src;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (args.length === 0) {
                            throw new Error("missing file to run");
                        }
                        return [4 /*yield*/, fs.readFile("".concat(args[0]), 'utf8')];
                    case 1:
                        src = _a.sent();
                        this.zse.exec(src);
                        return [2 /*return*/, ""];
                }
            });
        });
    };
    CLI.prototype.execute = function (cmd, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (cmd === "") {
                            throw new Error("missing command");
                        }
                        if (!this.commands.has(cmd)) {
                            throw new Error("the ".concat(cmd, " command is invalid"));
                        }
                        return [4 /*yield*/, this[cmd](args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CLI;
}());
exports.default = CLI;
//# sourceMappingURL=cli.js.map