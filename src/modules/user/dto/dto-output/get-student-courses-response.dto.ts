import { ApiProperty } from "@nestjs/swagger";

export class GetStudentCoursesResponseDto {
    @ApiProperty({ example: "www.thisIsaUrl.com" })
    courseThumbnailUrl: string;

    @ApiProperty({ example: "This is a slug" })
    courseSlug: string;

    @ApiProperty({ example: 4 })
    courseId: number;

    @ApiProperty({ example: "This is a description" })
    courseName: string;

    @ApiProperty({ example: 0.9, description: "The progress is given as a number between 0 and 1" })
    progress: number;
}