import { registerEnumType } from "@nestjs/graphql";


export enum GroupName {
    "UAA" = "UAA",
    "CONTACTS" = "CONTACTS",
}

registerEnumType(GroupName, {
    name: "GroupName"
})