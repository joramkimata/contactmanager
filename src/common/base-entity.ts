import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Generated, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
export class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Field()
    @Generated('uuid') // a658b-544563bc-98689-abcd987
    uuid: string;

    @Column({ default: false })
    deleted: boolean;




}