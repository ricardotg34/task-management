import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema'
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    async signUp({username, password}: AuthCredentialsDto): Promise<void>{
        const salt = await bcrypt.genSalt();
        try {
            await this.userModel.create({
                username: username,
                password: bcrypt.hashSync(password, salt),
                salt
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('user already exist');
            }
            else{
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword({username, password}: AuthCredentialsDto): Promise<{accessToken: string}>{
        try {
            const user: User = await this.userModel.findOne({username});
            if(user && bcrypt.hashSync(password, user.salt) === user.password){
                const payload: JwtPayload = {username: user.username};
                const accessToken = await this.jwtService.sign(payload);
                return { accessToken };
            }
            else {
                throw new BadRequestException('Either the username or the password is not valid.');
            }
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            else throw new InternalServerErrorException();
        }
    }


}
