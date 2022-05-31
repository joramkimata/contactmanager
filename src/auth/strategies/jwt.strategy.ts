import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "../services/auth.service";


export interface JwtPayload {
    user: string,
    refreshToken: boolean
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'qwert.2021',
        });
    }

    async validate(payload: JwtPayload) {

        // prevent passing refresh token as access token
        if (payload.refreshToken) {
            throw new UnauthorizedException();
        }

        const user = await this.authService.getUserFromJwtPayload(payload.user);

        if (!user) {
            throw new UnauthorizedException();
        }

        // checks if user logged out
        if (!user.refreshToken) {
            throw new UnauthorizedException();
        }

        return user;
    }
}