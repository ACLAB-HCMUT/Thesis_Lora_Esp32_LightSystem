import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async upload(fileName: string, file: Buffer, minetype: string, id: string) {
    try {
      const upload = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
          Key: fileName,
          Body: file,
          ContentType: minetype,
          ContentDisposition: 'inline',
        }),
      );
      if (upload.$metadata.httpStatusCode === 200) {
        const returnParams = {
          imageName: fileName,
          imageURL: `https://${this.configService.getOrThrow('S3_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_REGION')}.amazonaws.com/${fileName}`,
        };
        // modify image url in users
        const userImage = await this.userRepository.findOneBy({ id: id });
        userImage.imageURL = returnParams.imageURL;
        const response = this.userRepository.update(id, userImage);
        if (response) {
          throw new HttpException(
            `Successfully update image with ${id}`,
            HttpStatus.OK,
          );
        }
        return returnParams;
      }
      throw new HttpException('Failed to upload image', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw error;
    }
  }
}
