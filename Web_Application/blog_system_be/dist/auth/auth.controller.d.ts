import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivateDto, UpdateUserResponse, UserDto, UserUpdate } from 'src/user/dto/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(req: any): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<import("src/user/dto/user.dto").SignInResponse>;
    signup(user: UserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    activate(data: ActivateDto): Promise<"Account already activated" | "Verify account successfully" | "Wrongs activate code, please retry" | "Code has been expired, please click button to resend a activate code">;
    updateuserbyid(id: string, updateUserInformation: UserUpdate): Promise<UpdateUserResponse>;
}
