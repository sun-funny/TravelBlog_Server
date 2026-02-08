import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryContent, CountryContentDocument } from 'src/shemas/country-content';
import { CountryContentDto, CarouselPositionDto } from 'src/dto/country-content-dto';
import { ICountryContent, CarouselPosition } from 'src/interface/country-content';

@Injectable()
export class CountryContentService {
  constructor(
    @InjectModel(CountryContent.name) 
    private countryContentModel: Model<CountryContentDocument>
  ) {}

  async getContent(countryId: string): Promise<ICountryContent> {
    const content = await this.countryContentModel
      .findOne({ countryId })
      .lean()
      .exec();
    
    if (!content) {
      return this.createEmptyContent(countryId);
    }
    
    // Преобразование позиций для корректного возврата
    const result = {
      ...content,
      carouselPositions: content.carouselPositions?.map(pos => ({
        x: pos.x || 0,
        y: pos.y || 0,
        scale: pos.scale || 1,
        originalWidth: pos.originalWidth,
        originalHeight: pos.originalHeight
      })) || []
    };
    
    return result as unknown as ICountryContent;
  }

  async saveContent(countryContentDto: CountryContentDto): Promise<ICountryContent> {
    const { 
      countryId, 
      content, 
      carouselImages = [], 
      carouselPositions = [],
      updatedBy 
    } = countryContentDto;
  
    console.log('=== SAVING CONTENT ===');
    console.log('Country ID:', countryId);
    console.log('Carousel images count:', carouselImages.length);
    console.log('Carousel positions count:', carouselPositions.length);
  
    // Логирование позиций
    carouselPositions.forEach((pos, index) => {
      console.log(`Position ${index}:`, {
        x: pos?.x || 0,
        y: pos?.y || 0,
        scale: pos?.scale || 1,
        originalWidth: pos?.originalWidth,
        originalHeight: pos?.originalHeight
      });
    });
  
    // Валидация и преобразование позиций
    const validatedCarouselPositions = carouselImages.map((_, index) => {
      const pos = carouselPositions?.[index] || {};
      return {
        x: typeof pos.x === 'number' ? pos.x : 0,
        y: typeof pos.y === 'number' ? pos.y : 0,
        scale: typeof pos.scale === 'number' ? pos.scale : 1,
        originalWidth: typeof pos.originalWidth === 'number' ? pos.originalWidth : undefined,
        originalHeight: typeof pos.originalHeight === 'number' ? pos.originalHeight : undefined
      };
    });
  
    console.log('Validated positions count:', validatedCarouselPositions.length);
  
    const updateData = {
      content,
      carouselImages,
      carouselPositions: validatedCarouselPositions,
      updatedBy,
      updatedAt: new Date()
    };
  
    const existingContent = await this.countryContentModel.findOne({ countryId }).exec();
  
    if (existingContent) {
      // Обновляем существующий документ
      Object.assign(existingContent, updateData);
      const updated = await existingContent.save();
      
      console.log('Updated document with positions:', updated.carouselPositions?.length);
      return updated.toObject() as ICountryContent;
    } else {
      // Создаем новый документ
      const newContent = new this.countryContentModel({
        countryId,
        content,
        carouselImages,
        carouselPositions: validatedCarouselPositions,
        updatedBy,
        updatedAt: new Date()
      });
    
      const saved = await newContent.save();
      console.log('Saved new document with positions:', saved.carouselPositions?.length);
      return saved.toObject() as ICountryContent;
    }
  }

  async deleteContent(countryId: string): Promise<void> {
    await this.countryContentModel.deleteOne({ countryId }).exec();
  }

  async getAllContents(): Promise<ICountryContent[]> {
    const contents = await this.countryContentModel.find().lean().exec();
    return contents as unknown as ICountryContent[];
  }

  private async createEmptyContent(countryId: string): Promise<ICountryContent> {
    const emptyContent = new this.countryContentModel({
      countryId,
      content: '',
      carouselImages: [],
      carouselPositions: [], // 🔥 ДОБАВИТЬ
      updatedAt: new Date()
    });
    
    const saved = await emptyContent.save();
    return saved.toObject() as ICountryContent;
  }
}