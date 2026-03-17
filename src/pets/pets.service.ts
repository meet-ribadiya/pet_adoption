import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePetDto, FilterPetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, PetDocument } from './entities/pet.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async createPet(createPetDto: CreatePetDto) {
    const pet = await this.petModel.create(createPetDto)

    return {
      status: HttpStatus.CREATED,
      message: "Pet created successfully",
      data: pet
    }
  }

  async findAllPets(filterPetDto: FilterPetDto) {
    const skip = (filterPetDto.pageNumber - 1) * filterPetDto.pageLimit;

    let filter: Record<string, any> = { status: 'AVAILABLE' };

    if (filterPetDto.search) {
      const searchRegex = new RegExp(filterPetDto.search.trim(), 'i');

      filter.$or = [
        { name: searchRegex },
        { breed: searchRegex },
      ];
    }

    if (filterPetDto.species) {
      filter.species = filterPetDto.species;
    }

    if (filterPetDto.breed) {
      filter.breed = filterPetDto.breed;
    }

    if (filterPetDto.minAge !== undefined && filterPetDto.maxAge !== undefined) {
      filter.age = { $gte: filterPetDto.minAge, $lte: filterPetDto.maxAge };
    }

    const pets = await this.petModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(filterPetDto.pageLimit + 1)
      .lean();

    const isNextPageAvailable = pets.length > filterPetDto.pageLimit;

    if (isNextPageAvailable) {
      pets.pop();
    }

    return {
      status: HttpStatus.OK,
      message: "Pets found successfully",
      isNextPageAvailable,
      data: pets
    };
  }

  async findOnePet(id) {
    const data = await this.petModel.findOne({
      _id: id,
      status: 'AVAILABLE',
    }).lean();

    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Pet not found",
      }
    }
    return {
      status: HttpStatus.OK,
      message: "Pet found successfully",
      data
    };
  }

  async updatePet(id: string, updatePetDto: UpdatePetDto) {
    const pet = await this.petModel.findByIdAndUpdate(id, updatePetDto, { new: true }).lean();

    if (!pet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Pet not found",
      };
    }

    return {
      status: HttpStatus.OK,
      message: "Pet updated successfully",
      data: pet
    };
  }

  async removePet(id: string) {
    const pet = await this.petModel.findByIdAndDelete(id).lean();

    if (!pet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Pet not found",
      };
    }

    return {
      status: HttpStatus.OK,
      message: "Pet removed successfully",
      data: pet
    };
  }

  async filterPetsValues() {
    const result = await this.petModel.aggregate([
      {
        $match: { status: 'AVAILABLE' },
      },
      {
        $group: {
          _id: null,
          species: { $addToSet: '$species' },
          breed: { $addToSet: '$breed' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
        },
      },
    ]);

    const data = result[0] || {
      species: [],
      breed: [],
      minAge: 0,
      maxAge: 0,
    };

    return {
      status: HttpStatus.OK,
      message: "Filter values retrieved successfully",
      data,
    };
  }
}
