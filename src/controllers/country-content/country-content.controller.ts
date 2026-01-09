import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFile,
  UseGuards 
} from '@nestjs/common';
import { CountryContentService } from 'src/services/country-content/country-content.service';
import { CountryContentDto } from 'src/dto/country-content-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname as extnameFunc } from 'path'; // Переименовываем импорт
import { Express } from 'express';
import { JwtAuthGuard } from 'src/services/Authentication/jwt-auth.guard/jwt-auth.guard.service';

@Controller('country-content')
export class CountryContentController {
  constructor(private countryContentService: CountryContentService) {}

  @Get()
  async getAllContents() {
    return this.countryContentService.getAllContents();
  }

  @Get(':countryId')
  async getContent(@Param('countryId') countryId: string) {
    return this.countryContentService.getContent(countryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createContent(@Body() countryContentDto: CountryContentDto) {
    return this.countryContentService.saveContent(countryContentDto);
  }

  @Put(':countryId')
  @UseGuards(JwtAuthGuard)
  async updateContent(
    @Param('countryId') countryId: string,
    @Body() countryContentDto: CountryContentDto
  ) {
    return this.countryContentService.saveContent({
      ...countryContentDto,
      countryId
    });
  }

  @Delete(':countryId')
  @UseGuards(JwtAuthGuard)
  async deleteContent(@Param('countryId') countryId: string) {
    return this.countryContentService.deleteContent(countryId);
  }

@Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
  storage: diskStorage({
    destination: './assets/uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extnameFunc(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      console.log('Uploading file to:', './assets/uploads');
      console.log('Generated filename:', filename);
      callback(null, filename);
    },
  }),
    fileFilter: (req, file, callback) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const mimetype = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(extnameFunc(file.originalname).toLowerCase()); // Здесь тоже исправляем
      
      if (mimetype && extname) {
        return callback(null, true);
      }
      callback(new Error('Only image files are allowed!'), false);
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
  console.log('File uploaded successfully:', {
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype
  });
  
  return { 
    url: `/uploads/${file.filename}`,
    filename: file.filename
  };
}

@Delete('images')
@UseGuards(JwtAuthGuard)
async deleteImage(@Body() body: { imagePath: string }) {
  const fs = require('fs');
  const path = require('path');
  
  const imagePath = path.join(process.cwd(), 'assets', body.imagePath);
  
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      return { success: true, message: 'Изображение удалено' };
    } else {
      return { success: false, message: 'Файл не найден' };
    }
  } catch (error) {
    throw new Error(`Ошибка удаления файла: ${error.message}`);
  }
}

}