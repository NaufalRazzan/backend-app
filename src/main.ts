import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { HttpExceptionFilter } from './filters/exception.filter';
import * as dotenv from "dotenv";
import { MongoValidationErrorFilter } from './filters/mongo-filter.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config()

  const log_dir = process.env.LOG_DIR || 'log';

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.File({
          filename: `${log_dir}/server.log`,
          format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Http({
          host: '127.0.0.1',
          port: 3000,
          path: '/predict',
          headers: {
            'Content-Type': 'application/json'
          },
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.prettyPrint(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level} - ${info.message}`
            })
          )
        }),
      ],
      
    })
  });
  
  app.useGlobalFilters(new HttpExceptionFilter);
  app.useGlobalFilters(new MongoValidationErrorFilter)

  if(process.env.NODE_ENV === 'devs'){
    
    const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Movie Order API')
    .setDescription('API untuk backend skripsi')
    .addTag('Skripsi API')
    .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup('api', app, document)
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
