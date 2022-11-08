import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../users/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
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
}