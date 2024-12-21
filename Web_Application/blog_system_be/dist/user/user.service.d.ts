import { HttpStatus } from '@nestjs/common';
import { UserDto, SignInResponse, UserUpdate, DeleteUserResponse, UpdateUserResponse, ActivateDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private readonly userRepository;
    private readonly mailerService;
    private readonly configService;
    constructor(userRepository: Repository<UserEntity>, mailerService: MailerService, configService: ConfigService);
    emailExist(email: string): Promise<UserEntity>;
    emailNotExist: (email: string) => Promise<boolean>;
    sendEmail(email: string, name: string, code: string): Promise<any>;
    signup(user: UserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    activate(data: ActivateDto): Promise<"Account already activated" | "Verify account successfully" | "Wrongs activate code, please retry" | "Code has been expired, please click button to resend a activate code">;
    deleteuser(id: string): Promise<DeleteUserResponse>;
    profile(id: string): Promise<SignInResponse>;
    updateuserbyid(id: string, updateUserInformation: UserUpdate): Promise<UpdateUserResponse>;
    findAll(query: string, take: number, page: number): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        totalPage: number;
    }>;
}
