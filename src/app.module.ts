import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MovieModule } from './module/movie.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_USER,
      signOptions: { expiresIn: '30m' }
    }),
    ThrottlerModule.forRoot([{
      ttl: 6000,
      limit: 10
    }]),
    ScheduleModule.forRoot(),
    AuthModule,
    MovieModule
  ],
  controllers: [AppController],
  providers: [Logger]
})
export class AppModule {}
