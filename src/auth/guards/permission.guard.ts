import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { IPermission } from "../../users/decorators/has-permission.decorator";


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

        const accessMethod: IPermission = this.reflector.get<IPermission>('permission', context.getHandler());

        const accessClass:IPermission = this.reflector.get<IPermission>('permission', context.getClass());

        if (accessMethod) {
            const permsArray = await this.authService.getUserPermissions(user.username);

            if (!permsArray.some(p => p === accessMethod.name)) {
                throw new ForbiddenException('Access Denied');
            }
        }

        if (accessClass) {
            const permsArray = await this.authService.getUserPermissions(user.username);

            if (!permsArray.some(p => p === accessClass.name)) {
                throw new ForbiddenException('Access Denied');
            }
        }



        return true;
    }

}