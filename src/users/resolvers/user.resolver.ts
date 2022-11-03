import { GroupName } from "./../enums/permission-group.enum";
import { HasPermission } from "./../decorators/has-permission.decorator";
import { PermissionGuard } from "./../../auth/guards/permission.guard";
import { GqlAuthGuard } from "src/auth/guards/graphql.guard";
import { UpdateUserInput } from "./../inputs/update-user.input";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { UserInput } from "../inputs/user.input";
import { UserService } from "../services/user.service";
import { AssignRolesInput } from "../inputs/assign-roles.input";
import { UseGuards } from "@nestjs/common";
import { GetGraphqlUser } from "src/auth/decorators/get-user-graphql.decorator";


@Resolver(of => User)
@UseGuards(GqlAuthGuard, PermissionGuard)
export class UserResolver {

  constructor(
    private userService: UserService
  ) {
  }


  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  @HasPermission({
    name: "VIEW_USER_INFO",
    displayName: "View User Info",
    desciption: "View User Info",
    groupName: GroupName.UAA
  })
  getCurrentUserInfo(
    @GetGraphqlUser()
      user: User
  ) {
    return this.userService.getCurrentUserInfo(user);
  }

  @Mutation(returns => User)
  @HasPermission({
    name: "CREATE_USER",
    displayName: "Create User",
    desciption: "Create User",
    groupName: GroupName.UAA
  })
  createUser(
    @Args("userInput")
      userInput: UserInput
  ) {
    return this.userService.createUser(userInput);
  }

  // Challenge #1
  // updateUser Mutation
  @Mutation(returns => User)
  @HasPermission({
    name: "UPDATE_USER",
    displayName: "Update User",
    desciption: "Update User",
    groupName: GroupName.UAA
  })
  updateUser(
    @Args("uuid")
      uuid: string,
    @Args("userInput")
      userInput: UpdateUserInput
  ) {
    return this.userService.updateUser(uuid, userInput);
  }

  // Challenge #2
  // deleteUser Mutation
  @Mutation(returns => User)
  @HasPermission({
    name: "DELETE_USER",
    displayName: "Delete User",
    desciption: "Delete User",
    groupName: GroupName.UAA
  })
  deleteUser(
    @Args("uuid")
      uuid: string
  ) {
    return this.userService.deleteUser(uuid);
  }

  // Challenge #3
  // getUser Query
  @Query(returns => User)
  @HasPermission({
    name: "VIEW_USER",
    displayName: "View User",
    desciption: "View User",
    groupName: GroupName.UAA
  })
  getUser(
    @Args("uuid")
      uuid: string
  ) {
    return this.userService.getUser(uuid);
  }

  // Challenge #4
  // getUsers Query
  @Query(returns => [User])
  @HasPermission({
    name: "VIEW_USERS",
    displayName: "View Users",
    desciption: "View Users",
    groupName: GroupName.UAA
  })
  getUsers() {
    return this.userService.getUsers();
  }

  // Challenge #5
  // activateUser Mutation
  @Mutation(returns => User)
  //@HasPermission('ACTIVATE_USER')
  @HasPermission({
    name: "TEST_USER",
    displayName: "Test User",
    desciption: "Test User",
    groupName: GroupName.UAA
  })
  activateUser(
    @Args("uuid")
      uuid: string
  ) {
    return this.userService.activateUser(uuid);
  }

  // Challenge #6
  // blockUser Mutation
  @Mutation(returns => User)
  @HasPermission({
    name: "BLOCK_USER",
    displayName: "Block Users",
    desciption: "Block Users",
    groupName: GroupName.UAA
  })
  blockUser(
    @Args("uuid")
      uuid: string
  ) {
    return this.userService.blockUser(uuid);
  }

  // Challennge #7
  // changeUserPassword Mutation
  @Mutation(returns => User)
  @HasPermission({
    name: "CHANGE_USER_PASSWORD",
    displayName: "Change User Password",
    desciption: "Change User Password",
    groupName: GroupName.UAA
  })
  changeUserPassword(
    @Args("uuid")
      uuid: string,
    @Args("password")
      password: string,
    @Args("confirmPassword")
      confirmPassword: string
  ) {
    return this.userService.changeUserPassword(uuid, password, confirmPassword);
  }

  @Mutation(returns => User)
  @HasPermission({
    name: "ASSIGN_USER_ROLES",
    displayName: "Assign User Roles",
    desciption: "Assign User Roles",
    groupName: GroupName.UAA
  })
  assignRoles(
    @Args("assignRolesInput")
      assignRolesInput: AssignRolesInput
  ) {
    return this.userService.assignRoles(assignRolesInput);
  }


}


@Resolver(of => User)
export class PublicUserResolver {

  constructor(
    private userService: UserService
  ) {
  }

  @Mutation(returns => User)
  registerUser(
    @Args("userInput")
      userInput: UserInput
  ) {
    return this.userService.createUser(userInput);
  }
}