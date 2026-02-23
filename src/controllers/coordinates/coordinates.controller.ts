import { Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { CoordinatesService } from 'src/services/coodrinates/coordinates.service';
import { CoordinatesDto } from '../../dto/coordinates-dto';

@Controller('coordinates')
export class CoordinatesController {
  constructor(private coordinatesService: CoordinatesService) {}

  @Get()
  async getAllCoordinates() {
    return this.coordinatesService.getAllCoordinates();
  }

  @Get(':country')
  async getCoordinatesByCountry(@Param('country') country: string) {
    return this.coordinatesService.getCoordinatesByCountry(decodeURIComponent(country));
  }

  @Post()
  async createCoordinates(@Body() coordinatesDto: CoordinatesDto) {
    return this.coordinatesService.createCoordinates(coordinatesDto);
  }

  @Put(':country')
  async updateCoordinates(
    @Param('country') country: string, 
    @Body() coordinatesDto: CoordinatesDto
  ) {
    return this.coordinatesService.updateCoordinates(decodeURIComponent(country), coordinatesDto);
  }

  @Delete(':country')
  async deleteCoordinates(@Param('country') country: string) {
    return this.coordinatesService.deleteCoordinates(decodeURIComponent(country));
  }

  @Post('initialize')
  async initializeDefaultCoordinates() {
    await this.coordinatesService.initializeDefaultCoordinates();
    return { message: 'Default coordinates initialized successfully' };
  }

  @Get(':country/history')
    async getCoordinatesHistory(@Param('country') country: string) {
    // Здесь можно реализовать получение истории из отдельной коллекции
    // или из логов изменений
    return this.coordinatesService.getCoordinatesHistory(decodeURIComponent(country));
    }
}