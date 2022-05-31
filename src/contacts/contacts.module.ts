import { Contact } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContactResolver } from './resolvers/contact.resolver';
import { ContactService } from './services/contact.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Contact
    ]),
  ],
  providers: [
    ContactService,
    ContactResolver
  ]
})
export class ContactsModule { }
