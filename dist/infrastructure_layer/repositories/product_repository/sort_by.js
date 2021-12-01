"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SortBy {
    constructor(field, options) {
        var _a;
        this.field = field;
        if (options == undefined) {
            this.direction = "ascending";
            return;
        }
        this.direction = (_a = options.direction) !== null && _a !== void 0 ? _a : "ascending";
    }
}
exports.default = SortBy;
