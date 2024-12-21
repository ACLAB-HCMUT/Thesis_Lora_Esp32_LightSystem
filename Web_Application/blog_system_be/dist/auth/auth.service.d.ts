import { HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ActivateDto, SignInResponse, UserDto, UserSignIn, UserUpdate } from 'src/user/dto/user.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(user: UserSignIn): Promise<import("../user/user.entity").UserEntity>;
    signin(user: any): Promise<{
        access_token: string;
    }>;
    signup(user: UserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    activate(data: ActivateDto): Promise<"Account already activated" | "Verify account successfully" | "Wrongs activate code, please retry" | "Code has been expired, please click button to resend a activate code">;
    profile(id: string): Promise<SignInResponse>;
    updateuserbyid(id: string, updateUserInformation: UserUpdate): Promise<import("src/user/dto/user.dto").UpdateUserResponse>;
}
