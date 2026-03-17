import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from 'src/pets/entities/pet.entity';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Adoption, AdoptionDocument } from './entities/adoption.entity';
import { adoptionStatusEnum } from 'src/constant/adoption-status';
import { petStatusEnum } from 'src/constant/pet-status';

@Injectable()
export class AdoptionService {
  constructor(
    @InjectModel(Adoption.name) private adoptionModel: Model<AdoptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private jwtService: JwtService,
  ) { }

  async create(request, createAdoptionDto: CreateAdoptionDto) {
    const { petId, message } = createAdoptionDto;
    const userId = request["user"]["id"];

    const session = await this.adoptionModel.db.startSession();
    session.startTransaction();

    try {
      const [user, pet] = await Promise.all([
        this.userModel.exists({ _id: userId }),
        this.petModel.findOne({ _id: petId, status: petStatusEnum.AVAILABLE }).session(session),
      ]);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!pet) {
        throw new HttpException('Pet not available for adoption', HttpStatus.NOT_FOUND);
      }

      const existingAdoption = await this.adoptionModel.exists({
        userId,
        petId,
        status: { $in: [adoptionStatusEnum.PENDING, adoptionStatusEnum.APPROVED] },
      });

      if (existingAdoption) {
        throw new HttpException('Adoption request already exists', HttpStatus.BAD_REQUEST);
      }

      const adoption = await this.adoptionModel.create([{
        userId,
        petId,
        message,
      }], { session });

      await this.petModel.updateOne(
        { _id: petId },
        { $set: { status: petStatusEnum.PENDING } },
        { session }
      );

      await session.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: 'Adoption request created successfully',
        data: adoption[0],
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(pageNumber: number, pageLimit: number) {
    const skip = (pageNumber - 1) * pageLimit;

    const adoptions = await this.adoptionModel.aggregate([
      {
        $addFields: {
          userId: { $toObjectId: '$userId' },
          petId: { $toObjectId: '$petId' },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageLimit + 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'pets',
          localField: 'petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$pet',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          message: 1,
          createdAt: 1,

          user: {
            email: '$user.email',
            phoneNumber: '$user.phoneNumber',
          },

          pet: {
            name: '$pet.name',
            breed: '$pet.breed',
            species: '$pet.species',
            imageUrl: '$pet.imageUrl',
          },
        },
      },
    ]);

    const isNextPageAvailable = adoptions.length > pageLimit;

    if (isNextPageAvailable) {
      adoptions.pop();
    }

    return {
      status: HttpStatus.OK,
      message: 'Adoption requests retrieved successfully',
      isNextPageAvailable,
      data: adoptions,
    };
  }

  async findOne(request, id: string) {
    const userId = request["user"]["id"];

    const adoption = await this.adoptionModel.findOne({ _id: id, userId }).lean();

    if (!adoption) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Adoption request not found',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Adoption request retrieved successfully',
      data: adoption,
    };
  }

  async findAllByUserId(request, pageNumber: number, pageLimit: number) {
    const userId = request["user"]["id"];

    const skip = (pageNumber - 1) * pageLimit;

    const adoptions = await this.adoptionModel.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $addFields: {
          petId: { $toObjectId: '$petId' },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageLimit + 1 },
      {
        $lookup: {
          from: 'pets',
          localField: 'petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      {
        $unwind: {
          path: '$pet',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          message: 1,
          createdAt: 1,

          pet: {
            name: '$pet.name',
            breed: '$pet.breed',
            species: '$pet.species',
            imageUrl: '$pet.imageUrl',
          },
        },
      },
    ]);

    const isNextPageAvailable = adoptions.length > pageLimit;

    if (isNextPageAvailable) {
      adoptions.pop();
    }

    return {
      status: HttpStatus.OK,
      message: 'User adoption requests retrieved successfully',
      isNextPageAvailable,
      data: adoptions,
    };
  }

  async update(updateAdoptionDto: UpdateAdoptionDto) {
    const session = await this.adoptionModel.db.startSession();
    session.startTransaction();

    try {
      const adoption = await this.adoptionModel.findOne({ _id: updateAdoptionDto.id, status: adoptionStatusEnum.PENDING }).session(session);

      if (!adoption) {
        throw new HttpException('Adoption request not found', HttpStatus.NOT_FOUND);
      }

      let petStatusUpdate;

      if (updateAdoptionDto.status === adoptionStatusEnum.APPROVED) {
        petStatusUpdate = petStatusEnum.ADOPTED;
      }

      if (updateAdoptionDto.status === adoptionStatusEnum.REJECTED) {
        petStatusUpdate = petStatusEnum.AVAILABLE;
      }

      const updatedAdoption = await this.adoptionModel.findByIdAndUpdate(
        updateAdoptionDto.id,
        updateAdoptionDto,
        { new: true, session }
      ).lean();

      if (petStatusUpdate) {
        await this.petModel.updateOne(
          { _id: adoption.petId },
          { $set: { status: petStatusUpdate } },
          { session }
        );
      }

      await session.commitTransaction();

      return {
        status: HttpStatus.OK,
        message: 'Adoption request updated successfully',
        data: updatedAdoption,
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
