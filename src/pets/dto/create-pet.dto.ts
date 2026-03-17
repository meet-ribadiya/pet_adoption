import { ApiProperty } from "@nestjs/swagger";

export class CreatePetDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    age: number

    @ApiProperty()
    species: string

    @ApiProperty()
    breed: string

    @ApiProperty()
    description: string

    @ApiProperty()
    imageUrl: string
}

export class FilterPetDto {
    @ApiProperty({ required: false })
    search?: string;  

    @ApiProperty({ required: false })
    species?: string;   

    @ApiProperty({ required: false })
    breed?: string;

    @ApiProperty({ required: false })
    minAge?: number;

    @ApiProperty({ required: false })
    maxAge?: number;

    @ApiProperty({ required: false })
    pageNumber?: number;

    @ApiProperty({ required: false })
    pageLimit?: number;
}