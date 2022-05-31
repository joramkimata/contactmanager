import { Field, ObjectType } from "@nestjs/graphql";
import { type } from "os";
import { BaseEntity } from "src/common/base-entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Permission } from "./permission.entity";


@Entity("cm_roles")
@ObjectType()
export class Role extends BaseEntity {

    @Column()
    @Field()
    name: string;

    @Column({ name: 'display_name' })
    @Field()
    displayName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Field(type => [Permission], { nullable: true })
    @ManyToMany(type => Permission,)
    @JoinTable({
        name: 'cm_role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    })
    permissions: Permission[];

}