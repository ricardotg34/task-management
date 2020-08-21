import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as SchemaM } from 'mongoose';
import { TaskStatus } from "../task-status.enum";
import { User } from "src/auth/schemas/User.schema";

@Schema()
export class Task extends Document {
    @Prop()
    title: string;
    @Prop()
    description: string;
    @Prop({type: TaskStatus, default: TaskStatus.OPEN})
    status: TaskStatus;
    @Prop({type: SchemaM.Types.ObjectId, ref: User.name})
    user: SchemaM.Types.ObjectId
}

export const TaskSchema = SchemaFactory.createForClass(Task);