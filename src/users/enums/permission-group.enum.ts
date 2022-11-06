import { registerEnumType } from "@nestjs/graphql";


export enum GroupName {
    "UAA" = "UAA",
    "CONTACTS" = "CONTACTS",
    "DASHBOARD" = "DASHBOARD"
}

registerEnumType(GroupName, {
    name: "GroupName"
})