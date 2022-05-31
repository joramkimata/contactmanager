import { Field, InputType } from "@nestjs/graphql";
import { type } from "os";


@InputType()
export class AssignPermissionsInput {

    @Field()
    roleUUID: string;

    @Field(type => [String])
    permissionUUIDs: string[];

}