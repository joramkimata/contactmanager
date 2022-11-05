import { Field, ObjectType } from "@nestjs/graphql";
import { Permission } from "../entities/permission.entity";


@ObjectType()
export class GroupedByPermissionGroupNameDto {

    @Field()
    permissionGroupName: string;

    @Field(type => [Permission])
    permissions: Permission[];
}