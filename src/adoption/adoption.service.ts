import { Injectable } from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from 'src/pets/entities/pet.entity';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Adoption, AdoptionDocument } from './entities/adoption.entity';

@Injectable()
export class AdoptionService {
  constructor(
    @InjectModel(Adoption.name) private adoptionModel: Model<AdoptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private jwtService: JwtService,
  ) { }

  create(createAdoptionDto: CreateAdoptionDto) {
    return 'This action adds a new adoption';
  }

  findAll() {
    return `This action returns all adoption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adoption`;
  }

  update(id: number, updateAdoptionDto: UpdateAdoptionDto) {
    return `This action updates a #${id} adoption`;
  }

  remove(id: number) {
    return `This action removes a #${id} adoption`;
  }
}
