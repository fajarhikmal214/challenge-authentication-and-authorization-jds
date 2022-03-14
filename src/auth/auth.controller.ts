import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('v1/auth/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() response,
  ): Promise<any> {
    const data = await this.authService.signIn(authCredentialsDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'User signed in successfully',
      data,
    });
  }
}
