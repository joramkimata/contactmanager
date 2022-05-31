import { User } from './../users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GqlAuthGuard } from './guards/graphql.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'qwert.2021',
            signOptions: {
                expiresIn: '2min'
            }
        }),
        TypeOrmModule.forFeature([
            User
        ]),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        GqlAuthGuard,
        PermissionGuard
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule { }
