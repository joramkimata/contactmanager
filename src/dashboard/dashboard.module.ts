import { Module } from "@nestjs/common";
import { DashboardService } from "./services/dashboard.service";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { AuthModule } from "../auth/auth.module";
import { Contact } from "../contacts/entities/contact.entity";

@Module({
  providers: [DashboardService, DashboardResolver],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Contact
    ]),
    AuthModule
  ]
})
export class DashboardModule {
}
