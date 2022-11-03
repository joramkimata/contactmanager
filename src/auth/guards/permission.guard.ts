import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";


@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext) {

        // Logic
        const ctx = GqlExecutionContext.create(context);

        const { user } = ctx.getContext().req;

        if (!user) {
            throw new UnauthorizedException('Invalid User');
        }

        const accessMethod = this.reflector.get<string>('permission', context.getHandler());

        const accessClass = this.reflector.get<string>('permission', context.getClass());

        if (accessMethod) {
            const permsArray = await this.authService.getUserPermissions(user.username);

            if (!permsArray.some(p => p === accessMethod)) {
                throw new ForbiddenException('Access Denied - Method' + accessMethod);
            }
        }

        if (accessClass) {
            const permsArray = await this.authService.getUserPermissions(user.username);

            if (!permsArray.some(p => p === accessClass)) {
                throw new ForbiddenException('Access Denied - Class' + accessClass);
            }
        }



        return true;
    }

}