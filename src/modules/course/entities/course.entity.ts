import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseSection } from "../../course-section/entities/course-section.entity";
import { UserCourse } from "../../user/entities/user-course.entity";

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    thumbnail_url: string;

    @Column({ type: 'varchar', length: 1000})
    slug: string;

    @Column({ type: 'datetime', nullable: true })
    published_at: Date;

    @OneToMany(() => CourseSection, section => section.course)
    sections: CourseSection[];

    @OneToMany(()=>UserCourse, userCourse => userCourse.course)
    userCourses: UserCourse[];
}