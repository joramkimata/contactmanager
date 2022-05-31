import { SetMetadata } from "@nestjs/common";
import { GroupName } from "../enums/permission-group.enum";


export interface IPermission {
    name: string
    displayName: string,
    desciption?: string,
    groupName: GroupName
}


export const HasPermission = (ipermission: IPermission) => SetMetadata('permission', ipermission);