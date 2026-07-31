import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClienteAuthService } from './cliente-auth.service';
import { ClienteAuthController } from './cliente-auth.controller';
import { ClienteJwtStrategy } from './cliente-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN'),
        },
      } as JwtModuleOptions),
    }),
  ],
  controllers: [ClienteAuthController],
  providers: [ClienteAuthService, ClienteJwtStrategy],
})
export class ClienteAuthModule {}