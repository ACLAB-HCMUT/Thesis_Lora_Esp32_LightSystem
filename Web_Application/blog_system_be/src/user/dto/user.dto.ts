import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseCommon } from 'src/common/base.common';

export class UserDto extends BaseCommon {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Transform(({ obj }) => obj.firstName + ' ' + obj.lastName)
  @Expose()
  fullName: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  accountType: string;

  imageURL: string;

  activateCode: string;

  role: string;

  expiredCode: string;
}

export class UserSignIn {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export class SignInResponse {
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Transform(({ obj }) => obj.firstName + ' ' + obj.lastName)
  @Expose()
  fullName: string;

  @Expose()
  imageURL: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class UserUpdate {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  lastName: string;

  @IsString()
  firstName: string;
}

export class SignUpResponse {
  // id: string;
  statusCode: number;
  message: string;
}

export class DeleteUserResponse extends SignUpResponse {}
export class UpdateUserResponse extends SignUpResponse {}

export class ActivateDto {
  activateCode: string;
  email: string;
}
