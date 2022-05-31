import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/base-entity";
import { Contact } from "src/contacts/entities/contact.entity";
import { Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../enums/user-type.enum";
import { Role } from "./role.entity";

@Entity("cm_users")
@ObjectType()
export class User extends BaseEntity {

    @Column({ name: 'full_name' })
    @Field()
    fullName: string;

    @Column()
    @Field()
    username: string;

    @Column()
    @Field()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'user_type', nullable: true })
    @Field(type => UserType)
    userType: UserType;

    @Column({ default: false })
    @Field()
    active: boolean = false;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    // Many to Many 
    @Field(type => [Role], { nullable: true })
    @ManyToMany(type => Role,)
    @JoinTable({
        name: 'cm_user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    @OneToMany(() => Contact, contact => contact.user)
    contacts: Contact[];

}