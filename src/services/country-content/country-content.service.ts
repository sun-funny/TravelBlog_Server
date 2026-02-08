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
    const content = await this.countryContentModel.findOne({ countryId }).lean().exec();
    
    if (!content) {
      return this.createEmptyContent(countryId);
    }
    
    return content as unknown as ICountryContent;
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
    console.log('Carousel images:', carouselImages);
    console.log('Carousel positions count:', carouselPositions.length);
  
    // Детальный лог позиций
    carouselPositions.forEach((pos, index) => {
      console.log(`Position ${index}:`, {
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        originalWidth: pos.originalWidth,
        originalHeight: pos.originalHeight
      });
    });
  
    const existingContent = await this.countryContentModel.findOne({ countryId }).exec();
  
    // Валидация и преобразование позиций
    const validatedCarouselPositions = (carouselPositions || []).map((pos: any, index: number) => ({
      x: typeof pos.x === 'number' ? pos.x : 0,
      y: typeof pos.y === 'number' ? pos.y : 0,
      scale: typeof pos.scale === 'number' ? pos.scale : 1,
      originalWidth: typeof pos.originalWidth === 'number' ? pos.originalWidth : undefined,
      originalHeight: typeof pos.originalHeight === 'number' ? pos.originalHeight : undefined,
      _index: index // Для отладки
    }));
  
    console.log('Validated positions:', validatedCarouselPositions);
  
    const updateData = {
      content,
      carouselImages,
      carouselPositions: validatedCarouselPositions,
      updatedBy,
      updatedAt: new Date()
    };
  
    if (existingContent) {
      const updated = await this.countryContentModel.findOneAndUpdate(
        { countryId },
        updateData,
        { new: true }
      ).lean().exec();
    
      console.log('Updated document:', updated);
      return updated as unknown as ICountryContent;
    } else {
      const newContent = new this.countryContentModel({
        countryId,
        content,
        carouselImages,
        carouselPositions: validatedCarouselPositions,
        updatedBy,
        updatedAt: new Date()
      });
    
      const saved = await newContent.save();
      console.log('Saved new document:', saved);
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