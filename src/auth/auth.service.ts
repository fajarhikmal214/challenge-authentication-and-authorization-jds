import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ResponseJWT } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { google, Auth } from 'googleapis';

@Injectable()
export class AuthService {
  oauth2Client: Auth.OAuth2Client;

  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<ResponseJWT> {
    const { email, password } = authCredentialsDto;
    const user = await this.handleRegisteredUser(email, password);

    const responseJwt = await this.generateJwtToken(user);
    return responseJwt;
  }

  async authenticate(request: any) {
    const token = request.token;
    const tokenInfo = await this.getUserData(token);

    if (!tokenInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.handleRegisteredUser(tokenInfo.email);

    const responseJwt = await this.generateJwtToken(user);
    return responseJwt;
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauth2Client.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauth2Client,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(
    email: string,
    password: string | undefined = undefined,
  ): Promise<any> {
    const user = await this.authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (Boolean(password)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    if (user.deletedAt) throw new UnauthorizedException('User is deleted');

    return user;
  }

  async generateJwtToken(user: User): Promise<ResponseJWT> {
    const { id } = user;

    const access_token = await this.generateAccessToken(id);
    const refresh_token = await this.generateRefreshToken(id);

    const decodeAccessToken = await this.decodeJwtToken(access_token);

    const data = {
      type: this.configService.get('JWT_TYPE'),
      access_token,
      refresh_token,
      expires_in: decodeAccessToken.exp,
    };

    return data;
  }

  async generateAccessToken(id: string): Promise<string> {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET'),
        algorithm: this.configService.get('JWT_ALGORITHM'),
      },
    );
  }

  async generateRefreshToken(id: string): Promise<string> {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        algorithm: this.configService.get('JWT_REFRESH_ALGORITHM'),
      },
    );
  }

  async decodeJwtToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
}
