import { Controller, Req, Get, Post, Query, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto, FilterPetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new pet (Admin only)' })
  @Post('create/admin')
  createPet(@Body() createPetDto: CreatePetDto) {
    return this.petsService.createPet(createPetDto);
  }

  @ApiOperation({ summary: 'Get all available pets with filters and pagination' })
  @Get('find-all')
  findAllPets(@Query() filterPetDto: FilterPetDto) {
    return this.petsService.findAllPets(filterPetDto);
  }

  @ApiOperation({ summary: 'Get details of a single pet by ID' })
  @Get('find-one')
  findOnePet(@Query('id') id: string) {
    return this.petsService.findOnePet(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update pet details (Admin only)' })
  @Patch('update/admin')
  updatePet(@Query('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.updatePet(id, updatePetDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a pet from the system (Admin only)' })
  @Delete('remove/admin')
  removePet(@Query('id') id: string) {
    return this.petsService.removePet(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "find adopated pets (Admin only)" })
  @Get('find-adopted/admin')
  findAdoptedPets(
    @Query('pageNumber') pageNumber: number,
    @Query('pageLimit') pageLimit: number
  ) {
    return this.petsService.findAdoptedPets(pageNumber, pageLimit);
  }

  @ApiOperation({ summary: 'Get distinct values for species and breed for filtering' })
  @Get('filter-values')
  filterPetsValues() {
    return this.petsService.filterPetsValues();
  }

}
