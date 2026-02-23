import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/users/users.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { TravelsModule } from './controllers/travels/travels.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentsModule } from './controllers/comments/comments.module';
import { CountryContentModule } from './controllers/country-content/country-content.module'; 
import { TeamModule } from './controllers/team/team.module';
import { CoordinatesModule } from './controllers/coordinates/coordinates.module';
import { CoordinatesService } from './services/coodrinates/coordinates.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/travels'),
    UsersModule,
    TravelsModule,
    CommentsModule,
    CountryContentModule,
    TeamModule,
    CoordinatesModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets/uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets/upload_country'),
      serveRoot: '/upload_country',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private coordinatesService: CoordinatesService) {}

  async onModuleInit() {
    // Инициализируем координаты при запуске приложения
    await this.coordinatesService.initializeDefaultCoordinates();
  }
}