import { Field, InputType } from "@nestjs/graphql";



@InputType()
export class AssignRolesInput {

    @Field()
    userUUID: string;

    @Field(type => [String])
    roleUUIDs: string[];

}