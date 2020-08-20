import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v4 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = []; //MUST BE PRIVATE

  getAllTasks(): Task[] {
    return this.tasks;
  }

  filterTasksByStatus(filterDto: FilterTasksDto): Task[] {
    const {status, search} = filterDto;
    let tasks: Task[] = this.getAllTasks();
    if(status)
      tasks = tasks.filter(task => task.status == status);
    if(search)
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    return tasks;

  }

  getTaskById(id: string): Task{
    const found = this.tasks.find(task => task.id === id);
    if(!found){
      throw new NotFoundException(`Task with id: ${id} not found.`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task; //It is a good practice to return the created objext
  }

  updateTaskStatus(id: string, status: TaskStatus): Task{
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }


}
