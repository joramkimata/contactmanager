import { ObjectType, Field } from "@nestjs/graphql";
import { BaseEntity } from "src/common/base-entity";
import { User } from "src/users/entities/users.entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("cm_contacts_tt")
@ObjectType()
export class ContactTests extends BaseEntity {


    @Field()
    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Column({ name: 'is_public', default: false })
    isPublic: boolean = false;

    @Field(() => User)
    @ManyToOne(() => User, user => user.contacts)
    @JoinColumn({ name: 'user_id' })
    user: User;


}