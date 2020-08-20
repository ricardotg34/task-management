import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatuses: string[] = [
        TaskStatus.OPEN,
        TaskStatus.IN_PREGORESS,
        TaskStatus.DONE,
    ]
    transform(value: string): string {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: string) {
        const index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}