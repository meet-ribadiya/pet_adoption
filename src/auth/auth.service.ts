import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { userRoleEnum } from 'src/constant/user-role';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async createAccount(email, password, phoneNumber) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await this.userModel.create({
      email: email,
      password: hashedPassword,
      roles: userRoleEnum.ADMIN,
      phoneNumber: phoneNumber
    });

    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        userId: userData._id,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      },
    };
  }

  async verifyUser(email, password) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid credentials',
      };
    }

    const payload = {
      id: user._id,
      userEmail: user.email,
      roles: user.roles
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h',
    });

    return {
      status: HttpStatus.OK,
      message: 'User verified successfully',
      data: {
        access_token,
        userId: user._id,
        email: user.email,
        role: user.roles,
        phoneNumber: user.phoneNumber
      }
    };
  }

  async registerUser(email, password, phoneNumber) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await this.userModel.create({
      email: email,
      password: hashedPassword,
      roles: userRoleEnum.USER,
      phoneNumber: phoneNumber
    });

    return {
      status: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: {
        userId: userData._id,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      },
    };
  }
}
