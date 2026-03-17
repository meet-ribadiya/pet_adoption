import { ApiProperty, PartialType } from '@nestjs/swagger';
import { adoptionStatusEnum } from 'src/constant/adoption-status';

export class UpdateAdoptionDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ required: true, enum: adoptionStatusEnum, default: adoptionStatusEnum.APPROVED })
    status: adoptionStatusEnum;

}
