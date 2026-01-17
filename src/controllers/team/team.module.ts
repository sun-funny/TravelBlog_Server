import { TeamService } from "src/services/team/team.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/static/constants"; 
import { JwtStrategyService } from "src/services/Authentication/jwt-strategy/jwt-strategy.service";
import { TeamController } from "./team.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Team, TeamSchema } from "src/shemas/team";

@Module({
  controllers: [TeamController],
  imports: [MongooseModule.forFeature([
                {name: Team.name, 
                schema: TeamSchema }]),
            PassportModule,
            JwtModule.register({
              secret: jwtConstants.secret
            },)],
           
  providers: [TeamService, JwtStrategyService],
})
export class TeamModule {}