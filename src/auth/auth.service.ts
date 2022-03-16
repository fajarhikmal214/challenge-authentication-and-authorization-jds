import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ResponseJWT, ResponseMe } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { google, Auth } from 'googleapis';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

  async signIn(signInDto: SignInDto): Promise<ResponseJWT> {
    const { email, password } = signInDto;

    const user = await this.authRepository.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');

    if (Boolean(password)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');
    }

    if (!user.isActive) throw new UnauthorizedException('Akun tidak aktif');

    if (user.deletedAt)
      throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');

    const responseJwt = await this.generateJwtToken(user.id);
    return responseJwt;
  }

  async googleAuthenticate(
    googleAuthenticateDto: GoogleAuthenticateDto,
  ): Promise<ResponseJWT> {
    const { access_token } = googleAuthenticateDto;
    const userInfo = await this.getUserInfoFromGoogle(access_token);

    if (!userInfo) {
      throw new UnauthorizedException(
        'Login dengan Google gagal, silahkan coba lagi',
      );
    }

    const user = await this.authRepository.findByEmail(userInfo.email);
    if (!user) throw new UnauthorizedException('Akun tidak ditemukan');

    if (!user.isActive) throw new UnauthorizedException('Akun tidak aktif');

    if (user.deletedAt) throw new UnauthorizedException('Akun tidak ditemukan');

    const responseJwt = await this.generateJwtToken(user.id);
    return responseJwt;
  }

  async me(user: User): Promise<ResponseMe> {
    const { id, name, email } = user;

    const data = {
      id,
      name,
      email,
    };

    return data;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<ResponseJWT> {
    const { refresh_token } = refreshTokenDto;
    const payload = await this.verifyRefreshToken(refreshTokenDto);

    if (!payload) throw new UnauthorizedException('Refresh token tidak valid');

    const decodeRefreshToken = await this.decodeJwtToken(refresh_token);

    const user = await this.authRepository.findOne(payload.id);
    if (!user) throw new UnauthorizedException('Akun tidak ditemukan');

    if (!user.isActive) throw new UnauthorizedException('Akun tidak aktif');

    if (user.deletedAt) throw new UnauthorizedException('Akun tidak ditemukan');

    const responseJwt = await this.generateJwtToken(
      decodeRefreshToken.identifier,
    );

    return responseJwt;
  }

  async getUserInfoFromGoogle(access_token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauth2Client.setCredentials({
      access_token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauth2Client,
    });

    if (!userInfoResponse.data) return null;
    return userInfoResponse.data;
  }

  async verifyRefreshToken(refreshToken: RefreshTokenDto): Promise<any> {
    const { refresh_token } = refreshToken;

    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        algorithms: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }

  async generateJwtToken(identifier: string): Promise<ResponseJWT> {
    const access_token = await this.createAccessToken(identifier);
    const refresh_token = await this.createRefreshToken(identifier);

    const decodeAccessToken = await this.decodeJwtToken(access_token);

    const data = {
      type: this.configService.get('JWT_TYPE'),
      access_token,
      refresh_token,
      expires_in: decodeAccessToken.exp,
    };

    return data;
  }

  async createAccessToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        algorithm: this.configService.get('JWT_ACCESS_TOKEN_ALGORITHM'),
      },
    );
  }

  async createRefreshToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        algorithm: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
      },
    );
  }

  async decodeJwtToken(token: string): Promise<any> {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
