import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coordinates, CoordinatesDocument } from '../../shemas/coordinates.shema';
import { CoordinatesDto } from '../../dto/coordinates-dto';

@Injectable()
export class CoordinatesService {
  constructor(
    @InjectModel(Coordinates.name) private coordinatesModel: Model<CoordinatesDocument>,
  ) {}

  async getAllCoordinates(): Promise<Coordinates[]> {
    return this.coordinatesModel.find().exec();
  }

  async getCoordinatesByCountry(country: string): Promise<Coordinates | null> {
    return this.coordinatesModel.findOne({ country }).exec();
  }

  async createCoordinates(coordinatesDto: CoordinatesDto): Promise<Coordinates> {
    const createdCoordinates = new this.coordinatesModel(coordinatesDto);
    return createdCoordinates.save();
  }

  async updateCoordinates(country: string, coordinatesDto: CoordinatesDto): Promise<Coordinates | null> {
    return this.coordinatesModel.findOneAndUpdate(
      { country }, 
      { ...coordinatesDto, updatedAt: new Date() }, 
      { new: true }
    ).exec();
  }

  async deleteCoordinates(country: string): Promise<any> {
    return this.coordinatesModel.findOneAndDelete({ country }).exec();
  }

  async initializeDefaultCoordinates(): Promise<void> {
    const defaultCoordinates = [
      { country: 'Россия', latitude: 61.5240, longitude: 105.3188 },
      { country: 'Франция', latitude: 46.6034, longitude: 1.8883 },
      { country: 'Италия', latitude: 41.8719, longitude: 12.5674 },
      { country: 'Испания', latitude: 40.4637, longitude: -3.7492 },
      { country: 'Германия', latitude: 51.1657, longitude: 10.4515 },
      { country: 'Великобритания', latitude: 55.3781, longitude: -3.4360 },
      { country: 'США', latitude: 37.0902, longitude: -95.7129 },
      { country: 'Китай', latitude: 35.8617, longitude: 104.1954 },
      { country: 'Япония', latitude: 36.2048, longitude: 138.2529 },
      { country: 'Австралия', latitude: -25.2744, longitude: 133.7751 },
      // Добавьте остальные страны из вашего списка
    ];

    for (const coord of defaultCoordinates) {
      const exists = await this.coordinatesModel.findOne({ country: coord.country }).exec();
      if (!exists) {
        await this.createCoordinates(coord);
      }
    }
  }

    // Добавить метод для истории
    async getCoordinatesHistory(country: string): Promise<Coordinates[]> {
    // Если храните историю в отдельной коллекции
    // return this.coordinatesHistoryModel.find({ country }).sort({ createdAt: -1 }).exec();
    
    // Или возвращайте текущие координаты как единственную запись
    const current = await this.getCoordinatesByCountry(country);
    return current ? [current] : [];
    }
}