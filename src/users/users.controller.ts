import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @Get('find-all/admin')
  findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('pageLimit') pageLimit: number
  ) {
    return this.usersService.findAllUsers(pageNumber, pageLimit);
  }

}
