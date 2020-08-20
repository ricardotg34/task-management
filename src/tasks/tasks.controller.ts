import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './schemas/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  async getTasks(@Query() filterTasksDto: FilterTasksDto): Promise<Task[]> {
    if(Object.keys(filterTasksDto).length)
      return await this.tasksService.filterTasksByStatus(filterTasksDto);
    else
      return await this.tasksService.getAllTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task>{
    return this.tasksService.getTaskById(id);
  }
  // createTask(@Body() body) firs way to get the body
  // second way to get the body
  // createTask(
  //   @Body('title') title: string,
  //   @Body('description') description: string
  // )
  @Post()
  @UsePipes(ValidationPipe) //validates the incoming body
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Promise<Task>{
    return await this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

}
