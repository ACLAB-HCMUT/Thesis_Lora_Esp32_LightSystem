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
exports.ActivateDto = exports.UpdateUserResponse = exports.DeleteUserResponse = exports.SignUpResponse = exports.UserUpdate = exports.SignInResponse = exports.UserSignIn = exports.UserDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const base_common_1 = require("../../common/base.common");
class UserDto extends base_common_1.BaseCommon {
}
exports.UserDto = UserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj }) => obj.firstName + ' ' + obj.lastName),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
class UserSignIn {
}
exports.UserSignIn = UserSignIn;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserSignIn.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserSignIn.prototype, "password", void 0);
class SignInResponse {
}
exports.SignInResponse = SignInResponse;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SignInResponse.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ obj }) => obj.firstName + ' ' + obj.lastName),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "fullName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "imageURL", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], SignInResponse.prototype, "lastName", void 0);
class UserUpdate {
}
exports.UserUpdate = UserUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserUpdate.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UserUpdate.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserUpdate.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserUpdate.prototype, "firstName", void 0);
class SignUpResponse {
}
exports.SignUpResponse = SignUpResponse;
class DeleteUserResponse extends SignUpResponse {
}
exports.DeleteUserResponse = DeleteUserResponse;
class UpdateUserResponse extends SignUpResponse {
}
exports.UpdateUserResponse = UpdateUserResponse;
class ActivateDto {
}
exports.ActivateDto = ActivateDto;
//# sourceMappingURL=user.dto.js.map