require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

exports.upload_file = function(req,res){
	const values = Object.values(req.files)
  	const promises = values.map(image => cloudinary.uploader.upload(image.path))

  	Promise
    .all(promises)
    .then(results => res.json(results));
};
