import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/User.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>){}

  async getAllTasks(user: User): Promise<Task[]> {
    return await this.taskModel.find({user: user._id}).exec();
  }

  async filterTasksByStatus(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    const {status = '', search = ''} = filterDto;
    const query = {
      status: {$regex: status as string, $options: 'i'},
      description: {$regex: search as string, $options: 'i'},
      user: user._id
    };
    const tasks: Task[] = await this.taskModel.find(query).exec();
    return tasks;

  }

  async getTaskById(id: string, user?: User): Promise<Task>{
    let found: Task;
    try {
      found = await this.taskModel.findOne({_id: id, user: user?._id}).exec();
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

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const taskCreated = new this.taskModel({...createTaskDto, user: user._id});
    return taskCreated.save(); //It is a good practice to return the created objext
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>{
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const found = await this.getTaskById(id, user);
    await found.remove();
  }


}
