import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, min, MinLength } from "class-validator";
import { UserType } from "../enums/user-type.enum";



@InputType()
export class UserInput {

    @Field()
    @IsNotEmpty({ message: 'Full Name is required' })
    fullName: string;

    @Field()
    @IsNotEmpty({ message: 'User Name is required' })
    username: string;


    @Field()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;


    @Field()
    @MinLength(6)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Field()
    @MinLength(6)
    @IsNotEmpty({ message: 'Confirm Password is required' })
    confirmPassword: string;

    @Field(type => UserType)
    userType: UserType;


}