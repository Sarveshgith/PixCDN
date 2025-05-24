const router = require('express').Router();
const multer = require('multer');
const { uploadFile, getUrl } = require('../controllers/pixController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post('/upload', upload.single('image'), uploadFile);
router.get('/url/:slug', getUrl);

module.exports = router;