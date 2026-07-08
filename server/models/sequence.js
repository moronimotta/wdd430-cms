const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uniqueValidatorPlugin = uniqueValidator.default || uniqueValidator;

const sequenceSchema = new mongoose.Schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true },
});

sequenceSchema.plugin(uniqueValidatorPlugin);

module.exports = mongoose.model('Sequence', sequenceSchema);