import { GroupName } from './../../users/enums/permission-group.enum';
import { User } from 'src/users/entities/users.entity';
import { PermissionGuard } from './../../auth/guards/permission.guard';
import { JwtAuthGuard } from './../../auth/guards/jwt.guard';
import { ContactService } from './../services/contact.service';
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Contact } from "../entities/contact.entity";
import { ContactInput } from '../inputs/contact.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { HasPermission } from 'src/users/decorators/has-permission.decorator';
import { GetGraphqlUser } from 'src/auth/decorators/get-user-graphql.decorator';


@Resolver(of => Contact)
export class ContactResolver {

    constructor(private contactService: ContactService) { }

    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    getCurrentUserInfo(
        @GetGraphqlUser()
        user: User
    ) {
        return user;
    }


    // GetPublicContacts
    @Query(returns => [Contact])
    getPublicContacts() {
        return this.contactService.getPublicContacts();
    }

    // GetAllContacts
    @Query(returns => [Contact])
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "VIEW_CONTACTS",
        displayName: "View Contacts",
        desciption: "View Contacts",
        groupName: GroupName.CONTACTS,
    })
    getAllContacts() {
        return this.contactService.getAllContacts();
    }

    // GetSingleContact
    @Query(returns => Contact)
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "VIEW_CONTACT",
        displayName: "View Contact",
        desciption: "View Contact",
        groupName: GroupName.CONTACTS,
    })
    getSingleContact(
        @Args('uuid') uuid
            : string
    ) {
        return this.contactService.getSingleContact(uuid);
    }

    // UpdateContact
    @Mutation(returns => Contact)
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "UPDATE_CONTACT",
        displayName: "Update Contact",
        desciption: "Update Contact",
        groupName: GroupName.CONTACTS,
    })
    updateContact(
        @Args('uuid') uuid: string,
        @Args('contactInput') input: ContactInput
    ) {
        return this.contactService.updateContact(uuid, input);
    }

    // MakeContactPublic
    @Mutation(returns => Contact)
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "MAKE_CONTACT_PUBLIC",
        displayName: "Make Contact Public",
        desciption: "Make Contact Public",
        groupName: GroupName.CONTACTS,
    })
    makeContactPublic(
        @Args('uuid') uuid: string,
    ) {
        return this.contactService.makeContactPublic(uuid);
    }

    // DeleteContact
    @Mutation(returns => Contact)
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "DELETE_CONTACT",
        displayName: "Delete Contact",
        desciption: "Delete Contact",
        groupName: GroupName.CONTACTS,
    })
    deleteContact(
        @Args('uuid') uuid: string,
    ) {
        return this.contactService.deleteContact(uuid);
    }

    // Create Contact
    @Mutation(returns => Contact)
    @UseGuards(GqlAuthGuard, PermissionGuard)
    @HasPermission({
        name: "CREATE_CONTACT",
        displayName: "Create Contact",
        desciption: "Create Contact",
        groupName: GroupName.CONTACTS,
    })
    createContact(
        @GetGraphqlUser() user: User,
        @Args('contactInput') input: ContactInput
    ) {
        return this.contactService.createContact(input, user);
    }

    @Query(returns => [Contact])
    @UseGuards(GqlAuthGuard)
    getMyContacts(
        @GetGraphqlUser()
        user: User
    ) {
        return this.contactService.getMyContacts(user);
    }

}