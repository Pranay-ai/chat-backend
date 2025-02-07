import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

@Injectable()
export class AWSFileService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME; // Your actual bucket name

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION as string, // Ensure this is set
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const uniqueFileName = `profile-pictures/${Date.now()}-${fileName}`; // Keep original file extension

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType, // Ensure correct MIME type
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // ✅ Construct the correct file URL
      const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}
