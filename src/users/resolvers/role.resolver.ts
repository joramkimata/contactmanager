import { GroupName } from './../enums/permission-group.enum';
import { PermissionGuard } from './../../auth/guards/permission.guard';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { AssignPermissionsInput } from './../inputs/assign-permissions.input';
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "../entities/role.entity";
import { RoleInput } from "../inputs/role.input";
import { RoleService } from "../services/role.service";
import { UseGuards } from '@nestjs/common';
import { HasPermission } from '../decorators/has-permission.decorator';

@Resolver(of => Role)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({
    name: "VIEW_ROLES",
    displayName: "View Roles",
    desciption: "View Roles",
    groupName: GroupName.UAA,
})
export class RoleResolver {

    constructor(private roleService: RoleService) { }

    // Mutation for Create
    @Mutation(returns => Role)
    @HasPermission({
        name: "CREATE_ROLE",
        displayName: "Create Roles",
        desciption: "Create Roles",
        groupName: GroupName.UAA,
    })
    createRole(
        @Args('createRoleInput') createRoleInput: RoleInput
    ) {
        return this.roleService.createRole(createRoleInput);
    }


    // Mutation for Update
    @Mutation(returns => Role)
    @HasPermission({
        name: "UPDATE_ROLE",
        displayName: "Update Roles",
        desciption: "Update Roles",
        groupName: GroupName.UAA,
    })
    updateRole(
        @Args('uuid') uuid: string,
        @Args('updateRoleInput') updateRoleInput: RoleInput
    ) {
        return this.roleService.updateRole(uuid, updateRoleInput);
    }


    // Mutation for delete - soft delete
    @Mutation(returns => Role)
    @HasPermission({
        name: "DELETE_ROLE",
        displayName: "Delete Roles",
        desciption: "Delete Roles",
        groupName: GroupName.UAA,
    })
    deleteRole(
        @Args('uuid') uuid: string,
    ) {
        return this.roleService.deleteRole(uuid);
    }


    // Query for Get All
    @Query(returns => [Role],)
    getRoles() {
        return this.roleService.getRoles();
    }

    // Query for Get One
    @Query(returns => Role, { nullable: true })
    getRole(
        @Args('uuid') uuid: string
    ) {
        return this.roleService.getRole(uuid);
    }


    // Assigning Permissions
    @Mutation(returns => Role)
    @HasPermission({
        name: "ASSIGN_ROLE_PERMISSIONS",
        displayName: "Assign Permissions",
        desciption: "Assign Permissions",
        groupName: GroupName.UAA,
    })
    assignPermissions(
        @Args('assignPermissionsInput')
        assignPermissionsInput: AssignPermissionsInput
    ) {
        return this.roleService.assignPermissions(assignPermissionsInput);
    }



}