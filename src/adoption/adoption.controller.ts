import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { AdoptionService } from './adoption.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';


@ApiTags('Adoption')
@UseGuards(JwtAuthGuard)
@Controller('adoption')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) { }

  @ApiOperation({ summary: 'Create adoption request (User)' })
  @Post('create')
  create(
    @Req() request,
    @Body() createAdoptionDto: CreateAdoptionDto,
  ) {
    return this.adoptionService.create(request, createAdoptionDto);
  }


  @ApiOperation({ summary: 'Get all adoption requests (Admin)' })
  @Get('find-all/admin')
  findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('pageLimit') pageLimit: number
  ) {
    return this.adoptionService.findAll(pageNumber, pageLimit);
  }


  @ApiOperation({ summary: 'Get adoption request by ID' })
  @Get('find-one')
  findOne(
    @Req() request,
    @Query('id') id: string
  ) {
    return this.adoptionService.findOne(request, id);
  }


  @ApiOperation({ summary: 'Get logged-in user adoption requests (User - own only)' })
  @Get('/my-adoptions')
  findMyAdoptions(
    @Req() request,
    @Query('pageNumber') pageNumber: number,
    @Query('pageLimit') pageLimit: number
  ) {
    return this.adoptionService.findAllByUserId(request, pageNumber, pageLimit);
  }


  @ApiOperation({ summary: 'Update adoption status (Admin only)' })
  @Patch('update-status/admin')
  update(
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionService.update(updateAdoptionDto);
  }

}
