import { IPermission } from './../decorators/has-permission.decorator';
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { GroupName } from '../enums/permission-group.enum';
import { Role } from "../entities/role.entity";
import { GroupedByPermissionGroupNameDto } from "../dtos/grouped-by-permission-group-name.dto";



@Injectable()
export class PermissionService {

    private logger = new Logger(PermissionService.name);


    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>
    ) { }

    getPermissions() {
        return this.permissionRepository.find({
            where: {
                deleted: false
            }
        });
    }

    async seedPermissions(discoveryService: DiscoveryService) {

        const allPermissions =
            await discoveryService.providerMethodsWithMetaAtKey<IPermission>('permission');

        const allpermsx = await discoveryService.providersWithMetaAtKey<IPermission>('permission');

        const permissionsx = allpermsx.map(p => p.meta);

        const permissions = allPermissions.map((p) => p.meta);

        // permissions.concat(permissionsx).forEach((p) => {
        //     const permission = new Permission();
        //     permission.displayName = p.displayName;
        //     permission.name = p.name;
        //     permission.groupName = p.groupName;
        //     this.permissionRepository.save(permission).catch((err) => null);
        // });

        ///------------------

        const newPermissions = [];

        for (const p of permissions.concat(permissionsx)) {
            const dbPermission = await this.permissionRepository.findOne({
                name: p.name,
                deleted: false
            });

            if (dbPermission == null) {
                const permission = new Permission();
                permission.displayName = p.displayName;
                permission.name = p.name;
                permission.groupName = p.groupName;
                await this.permissionRepository.save(permission);
                newPermissions.push(permission);
            }
        }


        this.logger.debug(`**** Permissions ${newPermissions.length} seeded ****`);


        // const permissions = []

        // permissions.forEach(async (perm) => {
        //     const dbperm = await this.permissionRepository.findOne({
        //         where: {
        //             deleted: false,
        //             name: perm.name
        //         }
        //     });

        //     if (!dbperm) {
        //         const p = this.permissionRepository.create({
        //             ...perm
        //         });

        //         await this.permissionRepository.save(p);
        //     }
        // });


    }

    async getAllPermissionsGroupedByPermissionGroupName(roleUuid: string) {
        const role = await this.roleRepo.findOne({
            where: {
                deleted: false,
                uuid: roleUuid
            },
            relations: ['permissions']
        });

        if (!role) return [];

        const permxUuids = role.permissions.map(p => p.uuid);


        const all = Object.values(GroupName).map(async g => {
            const dto = new GroupedByPermissionGroupNameDto();
            dto.permissionGroupName = g;

            const permissions = await this.permissionRepository.find({
                deleted: false,
                groupName: g
            });

            dto.permissions = permissions.map(p => {

                if (permxUuids.includes(p.uuid)) {
                    p.belongToThisRole = true;
                } else {
                    p.belongToThisRole = false;
                }

                return p;
            });

            return dto;
        });

        return Promise.all(all);
    }
}