import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Create a Admin account' })
  @Post('admin-account')
  createaccount(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.createAccount(createUserDto.email, createUserDto.password, createUserDto.phoneNumber);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.registerUser(createUserDto.email, createUserDto.password, createUserDto.phoneNumber);
  }

  @ApiOperation({ summary: 'Login user with email and password' })
  @Post('log-in/verify')
  verifyUser(
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.authService.verifyUser(loginUserDto.email, loginUserDto.password);
  }

}
