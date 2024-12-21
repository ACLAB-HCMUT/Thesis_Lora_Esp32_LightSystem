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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const helper_1 = require("../ultils/helper");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(user) {
        try {
            const user_exist = await this.userService.emailExist(user.email);
            if (!user_exist) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isMatch = await (0, helper_1.comparePass)(user.password, user_exist.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            return user_exist;
        }
        catch (error) {
            throw new common_1.HttpException('Error from server', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async signin(user) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signup(user) {
        return this.userService.signup(user);
    }
    async activate(data) {
        return this.userService.activate(data);
    }
    async profile(id) {
        return this.userService.profile(id);
    }
    async updateuserbyid(id, updateUserInformation) {
        return this.userService.updateuserbyid(id, updateUserInformation);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map