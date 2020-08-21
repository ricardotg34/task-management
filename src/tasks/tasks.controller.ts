import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, HttpCode, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './schemas/task.schema';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/schemas/User.schema';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  async getTasks(
    @Query() filterTasksDto: FilterTasksDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    if(Object.keys(filterTasksDto).length)
      return await this.tasksService.filterTasksByStatus(filterTasksDto, user);
    else
      return await this.tasksService.getAllTasks(user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task>{
    return this.tasksService.getTaskById(id, user);
  }
  // createTask(@Body() body) firs way to get the body
  // second way to get the body
  // createTask(
  //   @Body('title') title: string,
  //   @Body('description') description: string
  // )
  @Post()
  @UsePipes(ValidationPipe) //validates the incoming body
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task>{
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task>{
    return await this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.tasksService.deleteTask(id, user);
  }

}
