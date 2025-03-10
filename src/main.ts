import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger as logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpErrorFilter } from './common/filters/error-filter.filter';
import { globalValidationPipes } from './common/pipes/globlaPipes.pipes';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(globalValidationPipes);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('API MAGIC ACADEMY')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3400);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
