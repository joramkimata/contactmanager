import { registerEnumType } from "@nestjs/graphql";


export enum UserType {
    "ADMIN" = "ADMIN",
    "NORMAL_USER" = "NORMAL_USER"
}

registerEnumType(UserType, {
    name: "UserType"
});