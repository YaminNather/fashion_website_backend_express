"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Category {
    constructor(id, _categoryName) {
        this.id = id;
        this._categoryName = _categoryName;
    }
    changeName(newName) {
        this._categoryName = newName;
    }
    get categoryName() {
        return this._categoryName;
    }
}
exports.default = Category;
