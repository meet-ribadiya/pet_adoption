import { Module } from '@nestjs/common';
import { AdoptionService } from './adoption.service';
import { AdoptionController } from './adoption.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from 'src/pets/entities/pet.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Adoption, AdoptionSchema } from './entities/adoption.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Adoption.name, schema: AdoptionSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),

  ],
  controllers: [AdoptionController],
  providers: [AdoptionService, JwtService],
  exports: [AdoptionService],
})
export class AdoptionModule { }
