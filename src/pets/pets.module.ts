import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './entities/pet.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

  ],
  controllers: [PetsController],
  providers: [PetsService, JwtService],
  exports: [PetsService],
})
export class PetsModule { }
