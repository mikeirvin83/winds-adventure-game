import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const swaggerPath = 'api-docs';
  const config = new DocumentBuilder()
    .setTitle('Winds Adventure Game API')
    .setDescription('Backend API for 3D martial arts adventure mobile game')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Anti-caching middleware for Swagger
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  SwaggerModule.setup(swaggerPath, app, document, {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .scheme-container { background: #f8f9fa; border: 1px solid #dee2e6; }
    `,
    customSiteTitle: 'Winds Adventure Game API',
    customfavIcon: 'https://img.icons8.com/color/48/000000/controller.png',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 API Documentation available at http://localhost:${port}/${swaggerPath}`);
}
bootstrap();
