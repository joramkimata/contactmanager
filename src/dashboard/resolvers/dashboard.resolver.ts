import { Query, Resolver } from "@nestjs/graphql";
import { DashboardDto } from "../dtos/dashboard.dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../auth/guards/graphql.guard";
import { PermissionGuard } from "../../auth/guards/permission.guard";
import { HasPermission } from "../../users/decorators/has-permission.decorator";
import { GroupName } from "../../users/enums/permission-group.enum";
import { DashboardService } from "../services/dashboard.service";

@Resolver(of => DashboardDto)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({
  name: "VIEW_DASHBOARD",
  displayName: "View Dashboard",
  desciption: "View Dashboard",
  groupName: GroupName.DASHBOARD,
})
export class DashboardResolver {

  constructor(private dashboardService: DashboardService) {
  }

  @HasPermission({
    name: "VIEW_NEW_USERS",
    displayName: "View New Users",
    desciption: "View New Users",
    groupName: GroupName.DASHBOARD,
  })
  @Query(returns => Number)
  getNewUsers() {
    return this.dashboardService.getNewUsers();
  }

}