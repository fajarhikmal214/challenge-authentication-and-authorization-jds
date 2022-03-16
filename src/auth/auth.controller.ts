import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('v1/auth')
export class AuthController {
  private oAuth2Client: any;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.oAuth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_CALLBACK_URL'),
    );
  }

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

  @Get('/get-google-auth-url')
  async getGoogleAuthUrl(@Res() response): Promise<any> {
    const scopes = ['email', 'profile'];

    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    response.send({
      url,
    });
  }

  @Post('/google/authenticate')
  async authenticate(@Body() request, @Res() response): Promise<void> {
    const data = await this.authService.authenticate(request);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'User signed in successfully',
      data,
    });
  }
}
