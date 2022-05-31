import { GroupName } from './../enums/permission-group.enum';
import { PermissionGuard } from './../../auth/guards/permission.guard';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { Permission } from "../entities/permission.entity";
import { PermissionService } from "../services/permission.service";
import { HasPermission } from '../decorators/has-permission.decorator';


@Resolver(of => Permission)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({
    name: "VIEW_PERMISSIONS",
    displayName: "View Permissions",
    desciption: "View Permissions",
    groupName: GroupName.UAA,
})
export class PermissionResolver {

    constructor(
        private permissionService: PermissionService
    ) { }

    @Query(returns => [Permission])
    getPermissions() {
        return this.permissionService.getPermissions();
    }


}