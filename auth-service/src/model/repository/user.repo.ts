import { ResetToken } from '../../types/entity.types';
import { EmailVerificationToken } from '../entities/email-verification-token';
import AppDataSource from "../../config/database";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import { AppError } from "../../custom.error/error";
import { ResetPasswordToken } from "../entities/reset-password-token";
import crypto from "crypto";

export class UserRepository {
    private userRepository = AppDataSource.getRepository(User);
    private resetPasswordRepository = AppDataSource.getRepository(ResetPasswordToken);
    private tokenExpirationTime = 60 * 60 * 1000; // 1 hour
    private EmailVerificationTokenRepository = AppDataSource.getRepository(EmailVerificationToken);
    

   public async createUser(email:string, password: string): Promise<User> {
        const hash_password = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            password: hash_password
        });
        return await this.save(user);
    }

    public async loginUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }   

     public async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    public async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    public async resetPassword(email: string, newPassword: string): Promise<void> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const hash_password = await bcrypt.hash(newPassword, 10);
        user.password = hash_password;
        await this.save(user);
    }

    private generateHashToken(): { resetToken: string, hash: string } {
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = crypto
        .createHash("sha256")
        .update(resetToken).digest("hex");

        return {
            resetToken,
            hash
        }
    }  

    public async forgotPassword(email: string): Promise<void> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const { resetToken, hash } = this.generateHashToken();
        const expiresAt = new Date(Date.now() + this.tokenExpirationTime);
        const resetTokenEntity = this.resetPasswordRepository.create({
            token_hash: hash,
            expiresAt,
            user
        });
        await this.resetPasswordRepository.save(resetTokenEntity);

        // send to notification service to send email to user with resetToken


    }   

    private async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}