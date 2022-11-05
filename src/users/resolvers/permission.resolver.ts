import { GroupName } from './../enums/permission-group.enum';
import { PermissionGuard } from './../../auth/guards/permission.guard';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Permission } from "../entities/permission.entity";
import { PermissionService } from "../services/permission.service";
import { HasPermission } from '../decorators/has-permission.decorator';
import { GroupedByPermissionGroupNameDto } from "../dtos/grouped-by-permission-group-name.dto";


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

    @Query(returns => [GroupedByPermissionGroupNameDto])
    getAllPermissionsGroupedByPermissionGroupName(
      @Args('roleUuid') roleUuid: string
    ) {
        return this.permissionService.getAllPermissionsGroupedByPermissionGroupName(roleUuid);
    }


}