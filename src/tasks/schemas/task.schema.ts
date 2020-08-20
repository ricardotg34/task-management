import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { TaskStatus } from "../task-status.enum";

@Schema()
export class Task extends Document {
    @Prop()
    title: string;
    @Prop()
    description: string;
    @Prop({type: TaskStatus, default: TaskStatus.OPEN})
    status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);