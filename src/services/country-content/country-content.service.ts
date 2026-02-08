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
      carouselPositions = [], // 🔥 ДОБАВИТЬ
      updatedBy 
    } = countryContentDto;
    
    console.log('Saving content for countryId:', countryId);
    console.log('Content length:', content?.length);
    console.log('Carousel images count:', carouselImages?.length);
    console.log('Carousel images:', carouselImages);
    console.log('Carousel positions count:', carouselPositions?.length); // 🔥 ЛОГИРОВАНИЕ
    
    const existingContent = await this.countryContentModel.findOne({ countryId }).exec();
    
    const updateData = {
      content,
      carouselImages,
      carouselPositions: carouselPositions.map(pos => ({
        x: pos.x || 0,
        y: pos.y || 0,
        scale: pos.scale || 1,
        originalWidth: pos.originalWidth,
        originalHeight: pos.originalHeight
      })),
      updatedBy,
      updatedAt: new Date()
    };
    
    if (existingContent) {
      const updated = await this.countryContentModel.findOneAndUpdate(
        { countryId },
        updateData,
        { new: true }
      ).lean().exec();
      
      return updated as unknown as ICountryContent;
    } else {
      const newContent = new this.countryContentModel({
        countryId,
        content,
        carouselImages,
        carouselPositions, // 🔥 ДОБАВИТЬ
        updatedBy,
        updatedAt: new Date()
      });
      
      const saved = await newContent.save();
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