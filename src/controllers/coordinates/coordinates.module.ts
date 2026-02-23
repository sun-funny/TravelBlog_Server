import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoordinatesController } from './coordinates.controller';
import { CoordinatesService } from 'src/services/coodrinates/coordinates.service';
import { Coordinates, CoordinatesSchema } from '../../shemas/coordinates.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coordinates.name, schema: CoordinatesSchema }
    ])
  ],
  controllers: [CoordinatesController],
  providers: [CoordinatesService],
  exports: [CoordinatesService]
})
export class CoordinatesModule {}