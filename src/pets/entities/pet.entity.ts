import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { petStatusEnum } from 'src/constant/pet-status';

export type PetDocument = Pet & Document;

function customTimestamp(): number {
    return new Date().getTime();
}

@Schema()
export class Pet {
    _id: mongoose.Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    species: string;

    @Prop()
    breed: string;

    @Prop()
    description: string;

    @Prop()
    imageUrl: string;

    @Prop()
    status: petStatusEnum;

    @Prop({ default: customTimestamp })
    createdAt: number;

    @Prop({ default: customTimestamp })
    updatedAt: number;

}
export const PetSchema = SchemaFactory.createForClass(Pet);