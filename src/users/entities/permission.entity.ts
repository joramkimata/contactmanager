import { GroupName } from './../enums/permission-group.enum';
import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/base-entity";
import { Column, Entity } from "typeorm";


@Entity("cm_permissions")
@ObjectType()
export class Permission extends BaseEntity {

    @Column()
    @Field()
    name: string;

    @Column({ name: 'display_name' })
    @Field()
    displayName: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true })
    desciption: string;

    @Column({ name: 'group_name' })
    @Field()
    groupName: GroupName;

    @Field({ nullable: true })
    belongToThisRole: Boolean;




}