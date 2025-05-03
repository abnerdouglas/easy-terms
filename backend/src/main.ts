import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: "http://localhost:5173",
  });

  const config = new DocumentBuilder()
    .setTitle("Easy Terms API")
    .setDescription("Documentação da API Easy Terms")
    .setVersion("1.0")
    .addTag("users")
    .addServer("http://localhost:8000", "Development Server")
    .addBearerAuth()
    .setLicense("MIT License", "https://opensource.org/licenses/MIT")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(8000);

}
bootstrap();
