import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonExceptionFilter } from './middleware/common-exception.filter';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("🚀 ~ bootstrap ~ process.env.PORT:", process.env.PORT)
  
  const app = await NestFactory.create<any>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.enableCors();

  const Swagger = new DocumentBuilder()
    .setTitle("practical_server")
    .setDescription("new practical_server for the backend")
    .setVersion("1.0.0")
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addSecurityRequirements('access-token')
    .build();

  const document = SwaggerModule.createDocument(app, Swagger);
  SwaggerModule.setup('practical_server', app, document);

  app.useGlobalFilters(new CommonExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  })
  );

  app.use(compression());
  app.use(morgan('combined'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
