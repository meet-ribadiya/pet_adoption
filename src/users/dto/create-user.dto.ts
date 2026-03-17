import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { userRoleEnum } from "src/constant/user-role";

export class CreateUserDto {
    @ApiProperty({ required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;

    @ApiProperty({ required: true })
    phoneNumber: string;

    @ApiProperty({
        required: true,
        default: userRoleEnum.USER,
        enum: userRoleEnum,
        enumName: 'userRoleEnum',
    })
    @IsEnum(userRoleEnum)
    roles: userRoleEnum;
}

export class LoginUserDto {
    @ApiProperty({ required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;


}