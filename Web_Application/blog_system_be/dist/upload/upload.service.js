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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
let UploadService = class UploadService {
    constructor(configService, userRepository) {
        this.configService = configService;
        this.userRepository = userRepository;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.getOrThrow('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    async upload(fileName, file, minetype, id) {
        try {
            const upload = await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
                Key: fileName,
                Body: file,
                ContentType: minetype,
                ContentDisposition: 'inline',
            }));
            if (upload.$metadata.httpStatusCode === 200) {
                const returnParams = {
                    imageName: fileName,
                    imageURL: `https://${this.configService.getOrThrow('S3_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_REGION')}.amazonaws.com/${fileName}`,
                };
                const userImage = await this.userRepository.findOneBy({ id: id });
                userImage.imageURL = returnParams.imageURL;
                const response = this.userRepository.update(id, userImage);
                if (response) {
                    throw new common_1.HttpException(`Successfully update image with ${id}`, common_1.HttpStatus.OK);
                }
                return returnParams;
            }
            throw new common_1.HttpException('Failed to upload image', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_1.Repository])
], UploadService);
//# sourceMappingURL=upload.service.js.map