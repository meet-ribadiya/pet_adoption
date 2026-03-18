import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async findAllUsers(pageNumber: number, pageLimit: number) {
    const page = pageNumber || 1;
    const limit = pageLimit || 10;
    const skip = (page - 1) * limit;

    const users = await this.userModel.aggregate([
      {
        $project: {
          password: 0,
        },
      },
      {
        $addFields: {
          isAdmin: {
            $cond: [{ $eq: ['$roles', 'ADMIN'] }, 1, 0],
          },
        },
      },
      {
        $sort: {
          isAdmin: -1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
      {
        $addFields: {
          userIdString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'adoptions',
          let: { userId: '$userIdString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$status', 'APPROVED'] },
                  ],
                },
              },
            },
            {
              $count: 'approvedAdoptionCount',
            },
          ],
          as: 'adoptionData',
        },
      },
      {
        $addFields: {
          approvedAdoptionCount: {
            $ifNull: [{ $arrayElemAt: ['$adoptionData.approvedAdoptionCount', 0] }, 0],
          },
        },
      },
      {
        $project: {
          adoptionData: 0,
          isAdmin: 0,
          userIdString: 0,
        },
      },
    ]);

    const isNextPageAvailable = users.length > limit;

    if (isNextPageAvailable) {
      users.pop();
    }

    return {
      status: 200,
      message: "Users retrieved successfully",
      isNextPageAvailable,
      data: users,
    };
  }
}
