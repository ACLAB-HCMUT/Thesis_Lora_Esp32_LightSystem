"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user/user.entity");
const upload_module_1 = require("./upload/upload.module");
const blog_module_1 = require("./blog/blog.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/passport/jwt-auth.guard");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const category_module_1 = require("./category/category.module");
const event_module_1 = require("./event/event.module");
const gateway_module_1 = require("./websocket/gateway.module");
const light_control_module_1 = require("./light_control/light_control.module");
const dynamo_module_1 = require("./dynamodb/dynamo.module");
const device_entity_1 = require("./device/device.entity");
const device_module_1 = require("./device/device.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            device_module_1.DeviceModule,
            dynamo_module_1.DynamoDbModule,
            event_module_1.EventModule,
            gateway_module_1.IOTGatewayModule,
            light_control_module_1.LightControlModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            user_module_1.UserModule,
            category_module_1.CategoryModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [user_entity_1.UserEntity, device_entity_1.DeviceEntity],
                synchronize: true,
            }),
            upload_module_1.UploadModule,
            blog_module_1.BlogModule,
            auth_module_1.AuthModule,
            mailer_1.MailerModule.forRootAsync({
                useFactory: async (configService) => ({
                    transport: {
                        host: configService.get('SMTP_HOST'),
                        port: configService.get('SMTP_PORT'),
                        secure: false,
                        auth: {
                            user: configService.get('SMTP_USER'),
                            pass: configService.get('SMTP_PASS'),
                        },
                    },
                    defaults: {
                        from: '"nest-modules" <modules@nestjs.com>',
                    },
                    template: {
                        dir: process.cwd() + '/src/email/templates/',
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map