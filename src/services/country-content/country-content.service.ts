import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryContent, CountryContentDocument } from 'src/shemas/country-content';
import { CountryContentDto} from 'src/dto/country-content-dto';
import { ICountryContent} from 'src/interface/country-content';

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
    
    return {
      _id: content._id,
      countryId: content.countryId,
      content: content.content,
      carouselImages: content.carouselImages || [],
      updatedAt: content.updatedAt,
      updatedBy: content.updatedBy
    } as ICountryContent;
  }

  async saveContent(countryContentDto: CountryContentDto): Promise<ICountryContent> {
    const { 
      countryId, 
      content, 
      carouselImages = [], 
      updatedBy 
    } = countryContentDto;
  
    console.log('=== SAVING CONTENT ===');
    console.log('Country ID:', countryId);
    console.log('Carousel images count:', carouselImages.length);
  
    const updateData = {
      content,
      carouselImages,
      updatedBy,
      updatedAt: new Date()
    };
  
    const existingContent = await this.countryContentModel.findOne({ countryId }).exec();
  
    if (existingContent) {
      // Обновляем существующий документ
      Object.assign(existingContent, updateData);
      const updated = await existingContent.save();
      
      console.log('Updated document');
      return {
        _id: updated._id,
        countryId: updated.countryId,
        content: updated.content,
        carouselImages: updated.carouselImages || [],
        updatedAt: updated.updatedAt,
        updatedBy: updated.updatedBy
      } as ICountryContent;
    } else {
      // Создаем новый документ
      const newContent = new this.countryContentModel({
        countryId,
        content,
        carouselImages,
        updatedBy,
        updatedAt: new Date()
      });
    
      const saved = await newContent.save();
      console.log('Saved new document');
      return {
        _id: saved._id,
        countryId: saved.countryId,
        content: saved.content,
        carouselImages: saved.carouselImages || [],
        updatedAt: saved.updatedAt,
        updatedBy: saved.updatedBy
      } as ICountryContent;
    }
  }

  async deleteContent(countryId: string): Promise<void> {
    await this.countryContentModel.deleteOne({ countryId }).exec();
  }

  async getAllContents(): Promise<ICountryContent[]> {
    const contents = await this.countryContentModel.find().lean().exec();
    
    return contents.map(content => ({
      _id: content._id,
      countryId: content.countryId,
      content: content.content,
      carouselImages: content.carouselImages || [],
      updatedAt: content.updatedAt,
      updatedBy: content.updatedBy
    })) as ICountryContent[];
  }

  private async createEmptyContent(countryId: string): Promise<ICountryContent> {
    const emptyContent = new this.countryContentModel({
      countryId,
      content: '',
      carouselImages: [],
      updatedAt: new Date()
    });
    
    const saved = await emptyContent.save();
    return {
      _id: saved._id,
      countryId: saved.countryId,
      content: saved.content,
      carouselImages: saved.carouselImages || [],
      updatedAt: saved.updatedAt,
      updatedBy: saved.updatedBy
    } as ICountryContent;
  }
}