"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamUpload = void 0;
const streamifier = require('streamifier');
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: "auto"
        }, (error, result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
exports.streamUpload = streamUpload;
