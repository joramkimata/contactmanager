import { Field, InputType } from "@nestjs/graphql";
import { MaxLength, MinLength } from "class-validator";


@InputType()
export class ContactInput {

    @Field()
    @MinLength(10)
    @MaxLength(14)
    phoneNumber: string
}