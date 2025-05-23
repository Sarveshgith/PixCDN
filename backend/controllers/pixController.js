const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
const BUCKET = process.env.SUPABASE_BUCKET;

const uploadFile = async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { originalname, buffer, mimetype } = file;

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];
        if (!allowedMimeTypes.includes(mimetype)) {
            return res.status(400).json({ error: "Invalid file type" });
        }

        const filePath = `public/${Date.now()}-${originalname}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, buffer, {
                contentType: mimetype,
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return res.status(500).json({ error: "Error uploading file" });
        }

        const { data, error: getPublicUrlError } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(filePath);

        if (getPublicUrlError) {
            console.error("Error getting public URL:", getPublicUrlError);
            return res.status(500).json({ error: "Error getting public URL" });
        }

        return res.status(200).json({
            message: "File uploaded successfully",
            publicUrl: data.publicUrl,
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Error uploading file" });
    }
}


module.exports = { uploadFile };