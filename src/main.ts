/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function testSystem() {
  try {
    const PORT = process.env.API_PORT;
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
      .setTitle('TATU test system')
      .setDescription('NodeJs, NestJs, Typescript')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT, () =>
      console.log('Server listening on port', +PORT),
    );
  } catch (error) {
    console.log(error.message);
  }
}
testSystem();
