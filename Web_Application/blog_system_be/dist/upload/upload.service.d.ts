import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
export declare class UploadService {
    private readonly configService;
    private readonly userRepository;
    private readonly s3Client;
    constructor(configService: ConfigService, userRepository: Repository<UserEntity>);
    upload(fileName: string, file: Buffer, minetype: string, id: string): Promise<{
        imageName: string;
        imageURL: string;
    }>;
}
