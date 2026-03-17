import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { adoptionStatusEnum } from 'src/constant/adoption-status';

export type AdoptionDocument = Adoption & Document;

function customTimestamp(): number {
    return new Date().getTime();
}

@Schema()
export class Adoption {
    _id: mongoose.Types.ObjectId;

    @Prop()
    userId: string;

    @Prop()
    petId: string;

    @Prop({ enum: adoptionStatusEnum, default: adoptionStatusEnum.PENDING })
    status: adoptionStatusEnum;

    @Prop()
    message: string;

    @Prop({ default: customTimestamp })
    createdAt: number;

    @Prop({ default: customTimestamp })
    updatedAt: number;

}
export const AdoptionSchema = SchemaFactory.createForClass(Adoption);
