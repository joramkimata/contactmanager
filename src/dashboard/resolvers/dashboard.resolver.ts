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

  @HasPermission({
    name: "VIEW_ALL_CONTACTS",
    displayName: "View All Contacts",
    desciption: "View All Contacts",
    groupName: GroupName.DASHBOARD,
  })
  @Query(returns => Number)
  getDashAllContacts() {
    return this.dashboardService.getAllContacts();
  }

  @HasPermission({
    name: "VIEW_PRIVATE_CONTACTS",
    displayName: "View Private Contacts",
    desciption: "View Private Contacts",
    groupName: GroupName.DASHBOARD,
  })
  @Query(returns => Number)
  getDashPrivateContacts() {
    return this.dashboardService.getPrivateContacts();
  }

  @HasPermission({
    name: "VIEW_PUBLIC_CONTACTS",
    displayName: "View Public Contacts",
    desciption: "View Public Contacts",
    groupName: GroupName.DASHBOARD,
  })
  @Query(returns => Number)
  getDashPublicContacts() {
    return this.dashboardService.getPublicContacts();
  }

}