import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ActivateDto,
  SignInResponse,
  UserDto,
  UserSignIn,
  UserUpdate,
} from 'src/user/dto/user.dto';
import { comparePass } from 'src/ultils/helper';
import { plainToInstance } from 'class-transformer';
import { access } from 'fs';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: UserSignIn) {
    try {
      const user_exist = await this.userService.emailExist(user.email);
      if (!user_exist) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await comparePass(user.password, user_exist.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user_exist;
    } catch (error) {
      throw new HttpException(
        'Error from server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(user: UserDto) {
    return this.userService.signup(user);
  }

  async activate(data: ActivateDto) {
    return this.userService.activate(data);
  }

  async profile(id: string) {
    return this.userService.profile(id);
  }

  async updateuserbyid(id: string, updateUserInformation: UserUpdate) {
    return this.userService.updateuserbyid(id, updateUserInformation);
  }
}
