import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../users/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "../../contacts/entities/contact.entity";


@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>
  ) {
  }

  async getNewUsers() {
    const users = await this.userRepo.find({
      where: {
        deleted: false,
        active: false
      }
    });

    return users.length;
  }

  async getAllContacts() {
      const contacts = await this.contactRepo.find({
        where: {
          deleted: false
        }
      });

      return contacts.length
  }

  async getPrivateContacts() {
    const contacts = await this.contactRepo.find({
      where: {
        deleted: false,
        isPublic: false
      }
    });

    return contacts.length
  }

  async getPublicContacts() {
    const contacts = await this.contactRepo.find({
      where: {
        deleted: false,
        isPublic: true
      }
    });

    return contacts.length
  }

  async getMyDashPublicContacts(user: User) {
    const contacts = await this.contactRepo.find({
      where: {
        deleted: false,
        isPublic: true,
        user
      }
    });

    return contacts.length
  }

  async getMyDashPrivateContacts(user: User) {
    const contacts = await this.contactRepo.find({
      where: {
        deleted: false,
        isPublic: false,
        user
      }
    });

    return contacts.length
  }
}