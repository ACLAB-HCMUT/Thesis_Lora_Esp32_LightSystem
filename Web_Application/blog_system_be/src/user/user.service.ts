import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UserDto,
  SignInResponse,
  UserUpdate,
  SignUpResponse,
  UserSignIn,
  DeleteUserResponse,
  UpdateUserResponse,
  ActivateDto,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  hashPassword,
  comparePass,
  paginateResponse,
  compareTime,
} from 'src/ultils/helper';
import { v4 as uuidv4 } from 'uuid';
import { currentTime, activationTime } from 'src/ultils/helper';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async emailExist(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  emailNotExist = async (email: string): Promise<boolean> => {
    const existEmail = await this.userRepository.findOneBy({
      email: email,
    });
    if (!existEmail) {
      return false;
    }
    return true;
  };

  async sendEmail(email: string, name: string, code: string) {
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

  async signup(user: UserDto) {
    try {
      const existEmail = await this.emailNotExist(user.email);
      if (existEmail) {
        throw new HttpException(
          `Email ${user.email} is already in use`,
          HttpStatus.CONFLICT,
        );
      }
      const newUser = {
        ...user,
        password: await hashPassword(user.password),
        imageURL:
          'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
        activateCode: uuidv4(),
        createAt: currentTime(),
        updatedAt: currentTime(),
        expiredCode: activationTime(),
      };
      const saveUser = await this.userRepository.insert(newUser);
      if (saveUser) {
        const sendEmail = this.sendEmail(
          newUser.email,
          newUser.fullName,
          newUser.activateCode,
        );
        console.log(sendEmail, 'check point');
        return {
          // id: saveUser.identifiers[0].id,
          statusCode: HttpStatus.OK,
          message: `User sign up successfully, please check email:${newUser.email} to activate your account`,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async activate(data: ActivateDto) {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (user.isActive === true) {
      return 'Account already activated';
    }
    if (user.isActive === false) {
      const compare_time = compareTime(user.expiredCode);
      if (compare_time === true) {
        if (user.activateCode == data.activateCode) {
          // Access DB and change isActive = true
          user.isActive = true;
          const response = await this.userRepository.update(
            { email: data.email },
            user,
          );
          if (response) {
            return 'Verify account successfully';
          }
        } else {
          return 'Wrongs activate code, please retry';
        }
      } else {
        return 'Code has been expired, please click button to resend a activate code';
      }
    }
  }

  async deleteuser(id: string): Promise<DeleteUserResponse> {
    try {
      const updateActive = await this.userRepository.findOneBy({ id: id });
      if (!updateActive) {
        throw new NotFoundException(`User with id ${id} not found `);
      }
      updateActive.isActive = false;
      // const response = await this.userRepository.delete({ id: id });
      // if (response.affected === 0) {
      //   throw new NotFoundException(`User with id ${id} not found`);
      // }
      const response = this.userRepository.update(id, updateActive);
      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: `Delete user by id ${id} successfully`,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async profile(id: string): Promise<SignInResponse> {
    try {
      const response = this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (response) {
        return response.then((result) => {
          if (result) {
            return plainToInstance(SignInResponse, result, {
              excludeExtraneousValues: true,
            });
          }
          throw new NotFoundException(`User with id ${id} not found`);
        });
      }
      throw new HttpException(
        `Unable to find user by id: ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateuserbyid(
    id: string,
    updateUserInformation: UserUpdate,
  ): Promise<UpdateUserResponse> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException(
          `Cannot find user with id: ${id} `,
          HttpStatus.NOT_FOUND,
        );
      }
      if (updateUserInformation.password) {
        updateUserInformation.password = await hashPassword(
          updateUserInformation.password,
        );
      }
      const updatedUser = { ...user, ...updateUserInformation };
      // Update User
      updatedUser.updatedAt = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
      });
      const response = await this.userRepository.update(id, updatedUser);
      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: `Update user by id ${id} successfully `,
        };
      }
    } catch (error) {}
  }

  async findAll(query: string, take: number, page: number) {
    const take_param = take || 5;
    const page_param = page || 1;
    const skip = (page_param - 1) * take_param;
    const data = await this.userRepository.findAndCount({
      take: take,
      skip: skip,
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'imageURL'],
    });

    return paginateResponse(data, page_param, take_param);
  }
}
