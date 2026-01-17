import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from 'src/shemas/team';
import { TeamDto } from 'src/dto/team-dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async getAllTeamMembers(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async getTeamMemberById(id: string): Promise<Team | null> {
    return this.teamModel.findOne({ id }).exec();
  }

  async createTeamMember(teamDto: TeamDto): Promise<Team> {
    const createdTeam = new this.teamModel(teamDto);
    return createdTeam.save();
  }

  async updateTeamMember(id: string, teamDto: TeamDto): Promise<Team | null> {
    return this.teamModel.findOneAndUpdate({ id }, teamDto, { new: true }).exec();
  }

  async deleteTeamMember(id: string): Promise<any> {
    return this.teamModel.findOneAndDelete({ id }).exec();
  }

  async deleteAllTeamMembers(): Promise<any> {
    return this.teamModel.deleteMany({}).exec();
  }
}