import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  SignUpResponse,
  UpdateUserResponse,
  UserDto,
  UserSignIn,
  UserUpdate,
} from './dto/user.dto';
import { SignInResponse } from './dto/user.dto';
import { UserService } from './user.service';
import { Public } from 'src/decorator/publicRoute';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UsePipes(new ValidationPipe())
  @Public()
  @Post('signup')
  async signup(@Body() user: UserDto): Promise<SignUpResponse> {
    try {
      const imageURL =
        'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';
      user.imageURL = imageURL;
      return await this.userService.signup(user);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  async deleteuser(@Param('id') id: string) {
    try {
      return this.userService.deleteuser(id);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() query: string,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    try {
      return this.userService.findAll(query, take, page);
    } catch (error) {}
  }
}
