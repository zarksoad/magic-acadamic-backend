/* eslint-disable no-unused-vars */
import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserReponseDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dto';
import { ApiPostOperation } from '../../common/decorators/swagger';
import { UserId } from '../../common/decorators/user/user-Id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CheckTokenStatus } from './services/email/check-token-status.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmailResponseDto } from './dto/dto-output/email-response.dto';
import { ApiGetOperation } from '../../common/decorators/swagger/get-swagger.decorator';
import { UserResponseDto } from './dto/dto-output/user-Response.dto';
import { GetLatestClassesInProgressByCourseByUserWithClassNumResponseDto, GetLatestClassesResponseDto } from './dto/dto-output/get-latest-classes-inprogress-byCourse-byUser-output.dto';
import { UserCourseDto } from './dto/enroll-user-course-dtos/user-course.dto';
import { GetStudentCoursesProgressResponseDto, GetStudentCoursesResponseDto } from './dto/dto-output/get-student-courses-response.dto';
import { UserEnrollmentResponseDto } from './dto/dto-output/enrollment.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly checkTokenStatus: CheckTokenStatus,
  ) { }

  @Post('register')
  @ApiPostOperation(
    'Create User', // Summary
    CreateUserReponseDto, // Response DTO
    CreateUserDto, // Request DTO
    false, // Bearer Token (si se requiere autenticación)
  )
  async create(@Body() createUserDto: CreateUserDto, @Query() token?: string) {
    const tokenDesectructur = token['token'];

    if (tokenDesectructur) {
      await this.checkTokenStatus.checkToken(tokenDesectructur);
      return await this.userService.create(createUserDto, tokenDesectructur);
    }

    return await this.userService.create(createUserDto);
  }

  @Post('/invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  @ApiPostOperation('Invite User', EmailResponseDto, SendMailDto, true)
  invite(@Body() sendMailDto: SendMailDto, @UserId() user: number) {
    return this.userService.sendEmail(sendMailDto, user);
  }

  @Get('/profile')
  @ApiGetOperation('Profile', UserResponseDto, true)
  @UseGuards(JwtAuthGuard)
  getByIdUSer(@UserId() user: number) {
    return this.userService.getUserById(user);
  }

  @Get('/user/classes/in-progress/latest')
  @UseGuards(JwtAuthGuard)
  @Roles(1)
  @ApiGetOperation('users', GetLatestClassesResponseDto, true)
  getLatestClassesInProgressByCourseByUser(
    @UserId() id: number
  ): Promise<GetLatestClassesInProgressByCourseByUserWithClassNumResponseDto[]> {
    return this.userService.getLatestClassesInProgressByCourseByUser(id)
  }

  @Post('/enroll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @ApiPostOperation(
    'users', UserEnrollmentResponseDto, UserCourseDto, true
  )
  async enroll(@UserId() userId: number, @Body() userCourseDto: UserCourseDto) {
    userCourseDto.userId = userId;
    return this.userService.enrollStudentInCourse(userCourseDto);
  }

  @Get('/user/enrolled-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @ApiGetOperation('users', GetStudentCoursesProgressResponseDto, true)
  async getUserCoursesAndProgress(
    @UserId() id: number
  ): Promise<GetStudentCoursesResponseDto[]> {
    return await this.userService.getStudentCourses(id)
  }
}
