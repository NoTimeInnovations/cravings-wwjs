import { Router } from "express";
import { deleteFileFromS3, uploadFileToS3 } from "./s3.js";

const router = Router();

router.post("/upload", async (req, res) => {
    try {
      const { imageUrl, filename } = req.body;
  
      const response = await fetch(imageUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
  
      const arrayBuffer = await response.arrayBuffer(); // Convert response to arrayBuffer
      const fileBuffer = Buffer.from(arrayBuffer); // Convert arrayBuffer to Buffer
  
      const fileUrl = await uploadFileToS3(fileBuffer, filename);
      res.status(200).json({ url: fileUrl }); // Return JSON response
    } catch (error) {
      console.error("Error in /upload:", error);
      res.status(500).json({ error: "Error in /upload", details: error.message });
    }
  });
  

router.delete("/delete", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).send("fileUrl is required");
    }

    const isDeleted = await deleteFileFromS3(fileUrl);
    res.status(200).json({ success: isDeleted });
  } catch (error) {
    console.error("Error in /delete:", error);
    res.status(500).json({ error: "Error in /delete", details: error.message });
  }
});

export default router;
