import { Module } from "@nestjs/common";
import { DashboardService } from "./services/dashboard.service";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [DashboardService, DashboardResolver],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    AuthModule
  ]
})
export class DashboardModule {
}
