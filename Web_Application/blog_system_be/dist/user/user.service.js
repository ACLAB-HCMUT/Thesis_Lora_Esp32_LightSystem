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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const helper_1 = require("../ultils/helper");
const uuid_1 = require("uuid");
const helper_2 = require("../ultils/helper");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(userRepository, mailerService, configService) {
        this.userRepository = userRepository;
        this.mailerService = mailerService;
        this.configService = configService;
        this.emailNotExist = async (email) => {
            const existEmail = await this.userRepository.findOneBy({
                email: email,
            });
            if (!existEmail) {
                return false;
            }
            return true;
        };
    }
    async emailExist(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('Email not found');
        }
        return user;
    }
    async sendEmail(email, name, code) {
        const sendEmail = this.mailerService.sendMail({
            to: email,
            from: this.configService.get('SMTP_USER'),
            subject: 'Activate your account here',
            template: 'register',
            context: {
                name: name,
                activationCode: code,
            },
        });
        return sendEmail;
    }
    async signup(user) {
        try {
            const existEmail = await this.emailNotExist(user.email);
            if (existEmail) {
                throw new common_1.HttpException(`Email ${user.email} is already in use`, common_1.HttpStatus.CONFLICT);
            }
            const newUser = {
                ...user,
                password: await (0, helper_1.hashPassword)(user.password),
                imageURL: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
                activateCode: (0, uuid_1.v4)(),
                createAt: (0, helper_2.currentTime)(),
                updatedAt: (0, helper_2.currentTime)(),
                expiredCode: (0, helper_2.activationTime)(),
            };
            const saveUser = await this.userRepository.insert(newUser);
            if (saveUser) {
                const sendEmail = this.sendEmail(newUser.email, newUser.fullName, newUser.activateCode);
                console.log(sendEmail, 'check point');
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: `User sign up successfully, please check email:${newUser.email} to activate your account`,
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    async activate(data) {
        const user = await this.userRepository.findOneBy({ email: data.email });
        if (user.isActive === true) {
            return 'Account already activated';
        }
        if (user.isActive === false) {
            const compare_time = (0, helper_1.compareTime)(user.expiredCode);
            if (compare_time === true) {
                if (user.activateCode == data.activateCode) {
                    user.isActive = true;
                    const response = await this.userRepository.update({ email: data.email }, user);
                    if (response) {
                        return 'Verify account successfully';
                    }
                }
                else {
                    return 'Wrongs activate code, please retry';
                }
            }
            else {
                return 'Code has been expired, please click button to resend a activate code';
            }
        }
    }
    async deleteuser(id) {
        try {
            const updateActive = await this.userRepository.findOneBy({ id: id });
            if (!updateActive) {
                throw new common_1.NotFoundException(`User with id ${id} not found `);
            }
            updateActive.isActive = false;
            const response = this.userRepository.update(id, updateActive);
            if (response) {
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: `Delete user by id ${id} successfully`,
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    async profile(id) {
        try {
            const response = this.userRepository.findOne({
                where: {
                    id: id,
                },
            });
            if (response) {
                return response.then((result) => {
                    if (result) {
                        return (0, class_transformer_1.plainToInstance)(user_dto_1.SignInResponse, result, {
                            excludeExtraneousValues: true,
                        });
                    }
                    throw new common_1.NotFoundException(`User with id ${id} not found`);
                });
            }
            throw new common_1.HttpException(`Unable to find user by id: ${id}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (error) {
            throw error;
        }
    }
    async updateuserbyid(id, updateUserInformation) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new common_1.HttpException(`Cannot find user with id: ${id} `, common_1.HttpStatus.NOT_FOUND);
            }
            if (updateUserInformation.password) {
                updateUserInformation.password = await (0, helper_1.hashPassword)(updateUserInformation.password);
            }
            const updatedUser = { ...user, ...updateUserInformation };
            updatedUser.updatedAt = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Ho_Chi_Minh',
            });
            const response = await this.userRepository.update(id, updatedUser);
            if (response) {
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: `Update user by id ${id} successfully `,
                };
            }
        }
        catch (error) { }
    }
    async findAll(query, take, page) {
        const take_param = take || 5;
        const page_param = page || 1;
        const skip = (page_param - 1) * take_param;
        const data = await this.userRepository.findAndCount({
            take: take,
            skip: skip,
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'imageURL'],
        });
        return (0, helper_1.paginateResponse)(data, page_param, take_param);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map