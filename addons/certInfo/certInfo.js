const express = require('express');
const router = express.Router();
const path = require('path');
const babelify = require(path.resolve('middleware/babelify'));
const pem = require('pem');
const util = require('util');
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const readCertificateInfo = util.promisify(pem.readCertificateInfo);
const readPkcs12 = util.promisify(pem.readPkcs12);
router.use(express.static(path.join(__dirname, 'public')));
router.use('/libs/dropzone', express.static(path.resolve(`${__dirname}/node_modules/dropzone/dist/`)));
router.use('/js', babelify(`${__dirname}/public/javascripts`, babelify.browserifySettings, {presets: ['@babel/preset-env']}));

router.get('/', async (req, res, next) => {
    res.render(`${__dirname}/views/index`, {title: 'Read Certificate'});
});

router.post('/', upload.single('file'), async (req, res, next) => {
    if (!req.file){
        return res.status(400).json("No file uploaded with key 'certificate'");
    }


    let info = null;
    if (req.file.mimetype === 'application/x-pkcs12'){
        const pfx = await readPkcs12(req.file.buffer, {p12Password:req.body.password}).catch(err => {
            return res.status(500).json({error:err.message});
        });
        info = await readCertificateInfo(pfx.cert).catch(err => {
            return res.status(500).json({error:err.message});
        });
    } else {
        info = await readCertificateInfo(req.file.buffer).catch(err => {
            return res.status(500).json({error:err.message});
        });
    }

    if (!info || !info.serial){
        return res.status(500).json(info);
    } else {
        res.json(info);
    }
});

module.exports = router;