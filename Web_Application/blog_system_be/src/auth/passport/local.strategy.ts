// Check user is signin or not, if ok, return user for controller to handle
// @Post('signin')
// @UseGuards(LocalAuthGuard)
// async handlesignin(@Request() req) {
//   return this.authService.signin(req.user);
// }
// After that, return this.authService.signin(req.user); to return access-token for user
/////////////////////////////////////////////////////////
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
