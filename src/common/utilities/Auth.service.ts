import { BadRequestException, Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { EmailService } from "./email.service";
import { UserRespository } from "src/users/user.repository";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService{

    constructor(
        private redisService: RedisService ,
        private emailService: EmailService ,
        private userRepository: UserRespository,

    ){}


    async sendOtp(id: string) {

        const user = await this.userRepository.findOneById(id);

        if (!user) {
            return {message: 'User not found', status: false, statusCode: 404};
        }


        // delete any existing OTP for the email
        await this.redisService.delete(id);

        

        const otp = this.generateOtp();

        await this.redisService.set(id, otp, 300);

        await this.emailService.sendEmail(
            user.email,
            'Chatter App OTP Verification',
            await this.generateOtpEmailTemplate(user?.email , otp, )
        );

        return {message: 'OTP sent successfully', status: true, statusCode: 200};
    }

   generateOtp() {

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        return otp;
    }

    async generateOtpEmailTemplate(email: string, otp: string): Promise<string> {
        // Fetch user details (assuming firstName & lastName exist)
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('User not found');
    
        const { firstName, lastName } = user;
        const expiryTime = 5; // OTP expires in 5 minutes
    
        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Hello ${firstName} ${lastName},</h2>
                <p style="font-size: 16px; color: #555;">
                    Thank you for signing up for <strong>Chatter App</strong>! To verify your email, use the following OTP code:
                </p>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 22px; font-weight: bold; border-radius: 5px; border: 1px solid #ddd;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #888;">
                    This OTP is valid for <strong>${expiryTime} minutes</strong>. If you did not request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd;" />
                <p style="font-size: 12px; color: #999;">
                    Regards, <br>
                    <strong>Chatter App Team</strong>
                </p>
            </div>
        `;
    }


    async verifyOtp(id: string, otp: string) {
        const savedOtp = await this.redisService.get(id);
        if (!savedOtp) {
            throw new BadRequestException('OTP expired');
        }
    
        if (otp !== savedOtp) {
            throw new BadRequestException('Invalid OTP');
        }

        const user = await this.userRepository.findOneById(id);

        if (!user) {
            throw new BadRequestException('User not found');
        }
        
        user.emailVerified = true;

        await this.userRepository.save( user)

    
        return { message: 'OTP verified successfully', status: true, statusCode: 200 };
    }
    
}