import { hashCompare, hashing } from './../../common/utils';
import { Repository } from 'typeorm';
import { User } from './../../users/entities/users.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategies/jwt.strategy';


@Injectable()
export class AuthService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async refresh(refreshToken: string) {

        try {
            const { user } = this.jwtService.decode(refreshToken) as JwtPayload;

            const dbUser = await this.userRepository.findOne({
                uuid: user,
                deleted: false,
                active: true
            });

            if (!dbUser) {
                throw new UnauthorizedException('User not found');
            }

            const hashedRefreshToken = dbUser.refreshToken;

            if (!hashedRefreshToken) {
                throw new UnauthorizedException();
            }

            if (!hashCompare(refreshToken, hashedRefreshToken)) {
                throw new UnauthorizedException();
            }

            const payload = { user, refreshToken: false };

            return {
                access_token: this.jwtService.sign(payload),
            }

        } catch (e) {
            throw new UnauthorizedException('Expired Refresh Token');
        }

    }

    async logout(user: User) {
        const dbUser = await this.userRepository.findOne({
            username: user.username
        });

        if (dbUser) {
            dbUser.refreshToken = '';
            await this.userRepository.save(dbUser);

            return {
                "message": "successfully logged out!"
            }
        }
    }


    async getUserPermissions(username: string): Promise<string[]> {
        const query = `SELECT pm.name  FROM cm_users u
        INNER JOIN  cm_user_roles ru ON ru.user_id=u.id
        INNER JOIN cm_role_permissions pr ON pr.role_id=ru.role_id
        INNER JOIN cm_permissions pm ON pm.id=pr.permission_id
        WHERE u.username='${username}' GROUP BY pm.name,u.username`;

        const perms = await this.userRepository.query(query);

        const permsArray = perms.map((p) => p.name);

        return permsArray;
    }

    async login({ username, password }: LoginDto) {
        const dbUser = await this.userRepository.findOne({
            where: {
                username
            }
        });

        if (!dbUser) {
            throw new UnauthorizedException();
        }

        if (!dbUser.active) {
            throw new UnauthorizedException();
        }


        // if (dbUser.password !== password) {
        //     throw new UnauthorizedException();
        // }

        if ((await hashCompare(password, dbUser.password)) === false) {
            throw new UnauthorizedException();
        }

        const payload = { user: dbUser.uuid, refreshToken: false };

        const payloadRefreshToken = { user: dbUser.uuid, refreshToken: true };

        const myRefreshToken = this.jwtService.sign(payloadRefreshToken, {
            expiresIn: '1d'
        });


        dbUser.refreshToken = await hashing(myRefreshToken);

        await this.userRepository.save(dbUser);

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: myRefreshToken,
            permissions: await this.getUserPermissions(dbUser.username)
        };
    }

    async getUserFromJwtPayload(uuid: string) {
        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        return user;
    }

}