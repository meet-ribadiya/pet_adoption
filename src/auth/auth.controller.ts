import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'User login using this API' })
  @Post('create-account')
  createaccount(
    @Query('email') email: string,
    @Query('password') password: string,
    @Query('roles') roles: string
  ) {
    return this.authService.createAccount(email, password, roles);
  }

  @ApiOperation({ summary: 'Verify user account with email and password' })
  @Post('log-in/verify')
  verifyUser(
    @Query('email') email: string,
    @Query('password') password: string
  ) {
    return this.authService.verifyUser(email, password);
  }

}
