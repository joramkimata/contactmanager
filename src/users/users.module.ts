import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicUserResolver, UserResolver } from "./resolvers/user.resolver";
import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './services/user.service';
import { User } from './entities/users.entity';
import { RoleResolver } from './resolvers/role.resolver';
import { RoleService } from './services/role.service';
import { Role } from './entities/role.entity';
import { PermissionService } from './services/permission.service';
import { Permission } from './entities/permission.entity';
import { PermissionResolver } from './resolvers/permission.resolver';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';

@Module({
    imports: [
        DiscoveryModule,
        AuthModule,
        TypeOrmModule.forFeature([
            User,
            Role,
            Permission
        ])
    ],
    providers: [
        UserResolver,
        UserService,
        RoleResolver,
        RoleService,
        PermissionService,
        PermissionResolver,
        PublicUserResolver
    ]
})
export class UsersModule implements OnModuleInit {

    constructor(private permissionService: PermissionService,
        private userService: UserService,
        private discoveryService: DiscoveryService) { }

    async onModuleInit() {
        await this.permissionService.seedPermissions(this.discoveryService);
        await this.userService.seedAdmin();
    }
}
