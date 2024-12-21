import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File, id: string): Promise<{
        imageName: string;
        imageURL: string;
    }>;
}
