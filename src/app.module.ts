import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/travels'),
    UsersModule,
    TravelsModule,
    CommentsModule,
    CountryContentModule,
    TeamModule,
    
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
export class AppModule {}