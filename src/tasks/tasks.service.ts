import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>){}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskModel.find().exec();
  }

  async filterTasksByStatus(filterDto: FilterTasksDto): Promise<Task[]> {
    const {status, search = ''} = filterDto;
    const tasks: Task[] = await this.taskModel.find({status, description: {$regex: search as string, $options: 'i'}}).exec();
    return tasks;

  }

  async getTaskById(id: string): Promise<Task>{
    let found: Task;
    try {
      found = await this.taskModel.findById(id).exec();
      console.log(found);
      if(!found){
        throw new NotFoundException(`Task with id: ${id} not found.`); // Send the error to catch
      }
      return found;
    } catch (error) {
      console.log(found);
      if(!(error instanceof NotFoundException))
        throw new InternalServerErrorException(`The id: ${id} is not valid`);
      else throw error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskCreated = new this.taskModel(createTaskDto);
    return taskCreated.save(); //It is a good practice to return the created objext
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const found = await this.getTaskById(id);
    await found.remove();
  }


}
