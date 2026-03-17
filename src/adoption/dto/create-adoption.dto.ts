import { ApiProperty } from "@nestjs/swagger";

export class CreateAdoptionDto {
    // @ApiProperty()
    // userId: string;

    @ApiProperty()
    petId: string;
    
    @ApiProperty()
    message: string;
}
