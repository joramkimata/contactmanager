import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql";
import { User } from "src/users/entities/users.entity";
import { Not, Repository } from "typeorm";
import { Contact } from "../entities/contact.entity";
import { ContactInput } from "../inputs/contact.input";


@Injectable()
export class ContactService {



    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>
    ) { }

    getMyContacts(user: User) {
        return this.contactRepository.find({
            deleted: false,
            user
        });
    }

    getPublicContacts() {
        return this.contactRepository.find({
            where: {
                deleted: false,
                isPublic: true
            },
            relations: ['user']
        });
    }

    async createContact({ phoneNumber }: ContactInput, user: User) {

        // validation


        const dbContact = await this.contactRepository.findOne({
            where: {
                user,
                phoneNumber,
                deleted: false
            }
        });

        if (dbContact) {
            throw new GraphQLError(`Contact exists`);
        }

        const newContact = new Contact();
        newContact.user = user;
        newContact.phoneNumber = phoneNumber;

        return this.contactRepository.save(newContact);
    }

    async deleteContact(uuid: string) {
        const dbContact = await this.getSingleContact(uuid);
        dbContact.deleted = true;
        return this.contactRepository.save(dbContact);
    }

    async makeContactPublic(uuid: string) {
        const dbContact = await this.getSingleContact(uuid);
        dbContact.isPublic = true;
        return this.contactRepository.save(dbContact);
    }

    async updateContact(uuid: string, { phoneNumber }: ContactInput) {
        const contact = await this.getSingleContact(uuid);

        const { id } = contact;

        const dbContact = await this.contactRepository.findOne({
            where: {
                deleted: false,
                id: Not(id),
                phoneNumber
            }
        });

        if (dbContact) {
            throw new GraphQLError(`Contact exists`);
        }

        contact.phoneNumber = phoneNumber;
        return this.contactRepository.save(contact);
    }

    async getSingleContact(uuid: string) {
        const dbContact = await this.contactRepository.findOne({
            where: {
                uuid,
                deleted: false
            }
        });
        if (!dbContact) {
            throw new GraphQLError(`Contact ${uuid} not found`)
        }

        return dbContact;
    }

    getAllContacts() {
        return this.contactRepository.find({
            where: {
                deleted: false,
            },
            relations: ['user']
        });
    }



}