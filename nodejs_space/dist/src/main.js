"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const swaggerPath = 'api-docs';
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Winds Adventure Game API')
        .setDescription('Backend API for 3D martial arts adventure mobile game')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    app.use(`/${swaggerPath}`, (req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        next();
    });
    swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
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
//# sourceMappingURL=main.js.map