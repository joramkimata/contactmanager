import { Resolver } from "@nestjs/graphql";
import { DashboardDto } from "../dtos/dashboard.dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../auth/guards/graphql.guard";
import { PermissionGuard } from "../../auth/guards/permission.guard";
import { HasPermission } from "../../users/decorators/has-permission.decorator";
import { GroupName } from "../../users/enums/permission-group.enum";

@Resolver(of => DashboardDto)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({
  name: "VIEW_DASHBOARD",
  displayName: "View Dashboard",
  desciption: "View Dashboard",
  groupName: GroupName.DASHBOARD,
})
export class DashboardResolver {

}