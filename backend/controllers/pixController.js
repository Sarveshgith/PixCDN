const { createClient } = require("@supabase/supabase-js");
const { nanoid } = require("nanoid");
const UrlModel = require("../models/urlModel");

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

        const { data: publicUrlData, error: getPublicUrlError } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(filePath);

        if (getPublicUrlError) {
            console.error("Error getting public URL:", getPublicUrlError);
            return res.status(500).json({ error: "Error getting public URL" });
        }

        const url = publicUrlData.publicUrl;
        const response = await createUrl(url);
        if (response.error) {
            return res.status(500).json({ error: response.error });
        }

        return res.status(200).json({
            message: "File uploaded and short URL created",
            data: response.data,
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Error uploading file" });
    }
};

const createUrl = async (url) => {
    try {
        if (!url) {
            return { error: "URL is required" };
        }

        const slug = nanoid(7);
        const newUrl = await UrlModel.create({ url, shortCode: slug });
        return { data: newUrl };
    } catch (error) {
        console.error("Error creating URL:", error);
        return { error: "Error creating URL" };
    }
};

const getUrl = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({ error: "Slug is required" });
        }
        const urlEntry = await UrlModel.findOne({ where: { shortCode: slug } });
        if (!urlEntry) {
            return res.status(404).json({ error: "URL not found" });
        }
        return res.redirect(urlEntry.url);
    } catch (error) {
        console.error("Error retrieving URL:", error);
        return res.status(500).json({ error: "Error retrieving URL" });
    }
}

module.exports = { uploadFile, getUrl };
