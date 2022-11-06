import { Permission } from './../entities/permission.entity';
import { GraphQLError } from 'graphql';
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { UserInput } from "../inputs/user.input";
import { UserType } from '../enums/user-type.enum';
import { UpdateUserInput } from '../inputs/update-user.input';

import { hashing } from '../../common/utils';
import { AssignRolesInput } from '../inputs/assign-roles.input';
import { Role } from '../entities/role.entity';



@Injectable()
export class UserService {


    private logger: Logger = new Logger("USER SERVICE");

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permRepository: Repository<Permission>
    ) {

    }

    async getCurrentUserInfo(user: User) {
        return this.userRepository.findOne({
            where: {
                deleted: false,
                id: user.id
            },
            relations: ['roles', 'roles.permissions']
        })
    }

    async seedAdmin() {



        const dbUser = await this.userRepository.findOne({
            username: 'admin',
            deleted: false
        });

        if (!dbUser) {

            const user = new User();
            user.username = 'admin';
            user.active = true;
            user.email = 'admin@graphql.org';
            user.fullName = 'Administrator';
            user.password = await hashing('admin.2021');

            const dbRole = await this.roleRepository.findOne({
                name: 'ADMIN',
                deleted: false
            });

            if (!dbRole) {
                const role = new Role();
                role.name = 'ADMIN';
                role.description = 'Administrator';
                role.displayName = 'Administrator';

                const perms = await this.permRepository.find({
                    deleted: false
                });

                if (perms) {
                    role.permissions = perms;
                }

                const newRole = await this.roleRepository.save(role);

                user.roles = [newRole];

                await this.userRepository.save(user);

                this.logger.log('Administror was created')
            }
        }
    }

    async assignRoles(assignRolesInput: AssignRolesInput) {
        const { userUUID: uuid, roleUUIDs } = assignRolesInput;

        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!user) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        let roles: Role[] = [];

        try {
            roles = await this.validateRoles(roleUUIDs);
        } catch (err) {
            throw new GraphQLError(err);
        }

        if (roles.length > 0) {
            // delete roles assigned user
            await this.deleteRoles(user.id);

            user.roles = roles;
        }


        return this.userRepository.save(user);
    }

    deleteRoles(id: number) {
        return this.userRepository.query(`delete from cm_user_roles where user_id=${id}`);
    }

    validateRoles(uuids: string[]): Role[] | PromiseLike<Role[]> {
        const promise: Promise<Role[]> = new Promise(async (resolve, reject) => {

            const roles = uuids.map(async uuid => {
                const role = await this.roleRepository.findOne({
                    where: {
                        deleted: false,
                        uuid
                    }
                });
                if (!role) {
                    reject(`Role ${uuid} not message`)
                }

                return role;
            });

            const mroles = await Promise.all(roles);

            resolve(mroles);

        });

        return promise;
    }

    async createUser({ fullName, email, userType, username, password, confirmPassword }: UserInput) {
        const dbUser = await this.userRepository.findOne({
            where: {
                username,
                deleted: false
            }
        });

        if (dbUser) {
            throw new GraphQLError(`Username ${username} exists`);
        }

        if (password !== confirmPassword) {
            throw new GraphQLError('Password mismatches');
        }

        const user = new User();
        user.fullName = fullName;
        user.username = username;
        user.email = email;
        user.password = await hashing(password);
        user.userType = userType;

        return this.userRepository.save(user);
    }

    async updateUser(uuid: string, userInput: UpdateUserInput) {

        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        // check if any existed before
        const user = await this.userRepository.findOne({
            where: {
                username: userInput.username,
                uuid: Not(uuid)
            }
        });

        console.log(user);

        if (user) {
            throw new GraphQLError(`Username exists!`);
        }

        dbUser.fullName = userInput.fullName;
        dbUser.email = userInput.email;
        dbUser.userType = userInput.userType;
        dbUser.username = userInput.username;

        return this.userRepository.save(dbUser);
    }

    async deleteUser(uuid: string) {
        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        dbUser.deleted = true;
        return this.userRepository.save(dbUser);
    }

    async activateUser(uuid: string) {
        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        dbUser.active = true;
        return this.userRepository.save(dbUser);
    }

    getUsers() {
        return this.userRepository.find({
            where: {
                deleted: false,
                userType: UserType.NORMAL_USER
            },
            relations: ['roles', 'roles.permissions']
        });
    }

    async getUser(uuid: string) {
        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            },
            relations: ['roles', 'roles.permissions']
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        return dbUser;
    }

    async blockUser(uuid: string) {
        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        dbUser.active = false;
        return this.userRepository.save(dbUser);
    }

    async changeUserPassword(uuid: string, password: string, confirmPassword: string) {
        const dbUser = await this.userRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });

        if (!dbUser) {
            throw new GraphQLError(`User ${uuid} not found`);
        }

        if (password !== confirmPassword) {
            throw new GraphQLError(`Password mismatches`);
        }

        dbUser.password = await hashing(password);
        return this.userRepository.save(dbUser);
    }


    changeLoggedInUserPassword(password: string, confirmPassword: string) {
        
    }
}