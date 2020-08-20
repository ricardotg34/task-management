import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterTasksDto: FilterTasksDto): Task[] {
    if(Object.keys(filterTasksDto).length)
      return this.tasksService.filterTasksByStatus(filterTasksDto);
    else
      return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task{
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
  createTask(@Body() createTaskDto: CreateTaskDto): Task{
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Task{
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

}
