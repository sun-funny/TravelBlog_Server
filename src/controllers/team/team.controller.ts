import { Body, Controller, Get, Post, Put, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TeamService } from 'src/services/team/team.service';
import { TeamDto } from 'src/dto/team-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  async getTeamMembers() {
    return this.teamService.getAllTeamMembers();
  }

  @Get(':id')
  async getTeamMemberById(@Param('id') id: string) {
    return this.teamService.getTeamMemberById(id);
  }

  @Post()
  async createTeamMember(@Body() teamDto: TeamDto) {
    return this.teamService.createTeamMember(teamDto);
  }

  @Put(':id')
  async updateTeamMember(@Param('id') id: string, @Body() teamDto: TeamDto) {
    // Получаем старую запись для удаления старого изображения
    const oldMember = await this.teamService.getTeamMemberById(id);
    if (oldMember && oldMember.image !== teamDto.image) {
      this.deleteOldImage(oldMember.image);
    }
    
    return this.teamService.updateTeamMember(id, teamDto);
  }

  @Delete(':id')
  async deleteTeamMember(@Param('id') id: string) {
    const member = await this.teamService.getTeamMemberById(id);
    if (member && member.image) {
      this.deleteOldImage(member.image);
    }
    
    return this.teamService.deleteTeamMember(id);
  }

  @Delete()
  async deleteAllTeamMembers() {
    return this.teamService.deleteAllTeamMembers();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './assets/uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  private deleteOldImage(imageUrl: string): void {
    try {
      if (imageUrl && imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/')[1];
        const filePath = join(__dirname, '..', '..', 'assets', 'uploads', filename);
        
        if (filePath && filePath !== join(__dirname, '..', '..', 'assets', 'uploads', '')) {
          unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  }
}