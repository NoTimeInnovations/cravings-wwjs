import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  import {
    S3_ACCESS_KEY,
    S3_BUCKET,
    S3_REGION,
    S3_SECRET_KEY,
  } from "../utils/env.js";
  
  const s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    requestTimeout: 120000,
    maxAttempts: 3,
  });

  export async function uploadFileToS3(file, filename) {
    try {
      if (!file) throw new Error("File not provided");
  
      let buffer;
      let contentType;
      let fileName = filename || `menu-images/${Date.now()}.jpg`;
  
      if (typeof file === "string" && file.startsWith("data:")) {
        // Convert base64 to buffer
        const base64Data = file.split(",")[1];
        buffer = Buffer.from(base64Data, "base64");
        contentType = file.match(/^data:(.*?);base64/)?.[1] || "image/jpeg";
      } else if (file instanceof Buffer) {
        // If it's already a buffer
        buffer = file;
        contentType = "application/octet-stream";
      } else if (file.arrayBuffer) {
        // Handle File/Blob objects (Browser)
        buffer = Buffer.from(await file.arrayBuffer());
        contentType = file.type || "image/jpeg";
      } else {
        throw new Error("Unsupported file format");
      }
  
      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      };
  
      await s3Client.send(new PutObjectCommand(uploadParams));
  
      return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error("Error in uploadFileToS3:", error);
      throw error;
    }
  }
  
  export async function deleteFileFromS3(fileUrl) {
    try {
      if (!fileUrl) throw new Error("File URL is required");
  
      // Extract correct key from file URL
      const key = decodeURIComponent(new URL(fileUrl).pathname.replace(/^\/+/, ""));
  
      const deleteParams = {
        Bucket: S3_BUCKET,
        Key: key,
      };
  
      await s3Client.send(new DeleteObjectCommand(deleteParams));
  
      return true;
    } catch (error) {
      console.error("Error in deleteFileFromS3:", error);
      throw error;
    }
  }
  