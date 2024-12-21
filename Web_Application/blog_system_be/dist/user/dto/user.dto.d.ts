import { BaseCommon } from 'src/common/base.common';
export declare class UserDto extends BaseCommon {
    email: string;
    lastName: string;
    firstName: string;
    fullName: string;
    password: string;
    accountType: string;
    imageURL: string;
    activateCode: string;
    role: string;
    expiredCode: string;
}
export declare class UserSignIn {
    email: string;
    password: string;
}
export declare class SignInResponse {
    id: string;
    email: string;
    password: string;
    fullName: string;
    imageURL: string;
    firstName: string;
    lastName: string;
}
export declare class UserUpdate {
    email: string;
    password?: string;
    lastName: string;
    firstName: string;
}
export declare class SignUpResponse {
    statusCode: number;
    message: string;
}
export declare class DeleteUserResponse extends SignUpResponse {
}
export declare class UpdateUserResponse extends SignUpResponse {
}
export declare class ActivateDto {
    activateCode: string;
    email: string;
}
