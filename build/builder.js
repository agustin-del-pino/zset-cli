"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var StringBuilder = /** @class */ (function () {
    function StringBuilder() {
        this.buffer = [];
        this.lines = 0;
    }
    StringBuilder.prototype.write = function (s) {
        if (this.buffer[this.lines] === undefined) {
            this.buffer.push("");
        }
        this.buffer[this.lines] += s;
        return this;
    };
    StringBuilder.prototype.line = function (s) {
        this.buffer.push(s);
        this.lines++;
        return this;
    };
    StringBuilder.prototype.end = function () {
        return this.line("");
    };
    StringBuilder.prototype.newline = function () {
        return this.line("");
    };
    StringBuilder.prototype.input = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        fn.apply(void 0, __spreadArray([this], args, false));
        return this;
    };
    StringBuilder.prototype.toString = function () {
        return this.buffer.join("\n");
    };
    return StringBuilder;
}());
exports.default = StringBuilder;
//# sourceMappingURL=builder.js.map