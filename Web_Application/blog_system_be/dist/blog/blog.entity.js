"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogEntity = void 0;
const typeorm_1 = require("typeorm");
let BlogEntity = class BlogEntity {
};
exports.BlogEntity = BlogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BlogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: 'longtext',
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "authorID", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        default: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
        }),
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        default: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
        }),
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "imageURL", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
    }),
    __metadata("design:type", String)
], BlogEntity.prototype, "categoryID", void 0);
exports.BlogEntity = BlogEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'blogs',
    })
], BlogEntity);
//# sourceMappingURL=blog.entity.js.map