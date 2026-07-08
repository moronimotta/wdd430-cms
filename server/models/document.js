const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uniqueValidatorPlugin = uniqueValidator.default || uniqueValidator;

const documentChildSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
}, { _id: false });

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  children: [documentChildSchema],
});

documentSchema.plugin(uniqueValidatorPlugin);

module.exports = mongoose.model('Document', documentSchema);