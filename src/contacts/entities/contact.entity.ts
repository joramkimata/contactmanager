import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/common/base-entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cm_contacts")
@ObjectType()
export class Contact extends BaseEntity {


    @Field()
    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Field()
    @Column({ name: 'is_public', default: false })
    isPublic: boolean = false;

    @Field(() => User)
    @ManyToOne(() => User, user => user.contacts)
    @JoinColumn({ name: 'user_id' })
    user: User;


}