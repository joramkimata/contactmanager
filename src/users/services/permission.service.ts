import { IPermission } from './../decorators/has-permission.decorator';
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { GroupName } from '../enums/permission-group.enum';



@Injectable()
export class PermissionService {


    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>
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
}