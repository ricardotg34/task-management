import { Document } from 'mongoose'
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class User extends Document {
    @Prop({unique: true})
    username: string;
    @Prop()
    password: string;
    @Prop()
    salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);