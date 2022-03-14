import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { ResponseJWT } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<ResponseJWT> {
    const { email, password } = authCredentialsDto;

    const user = await this.authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    if (user.deletedAt) throw new UnauthorizedException('User is deleted');

    const responseJwt = await this.generateJwtToken(user);

    return responseJwt;
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
