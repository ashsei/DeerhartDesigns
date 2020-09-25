const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product.js');
const { errorHandler } = require('../helpers/dbErrorHandler.js');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded.'
            });
        }
        // Validates Required Fields
        const { name, description, price, category, quantity, height, length } = fields;
        if (!name || !description || !price || !category || !quantity || !height || !length) {
            return res.status(400).json({
                error: 'All fields are required.'
            });
        }
        let product = new Product(fields);
        // Validates Image Size
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image size must be less than 1 MB.'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};