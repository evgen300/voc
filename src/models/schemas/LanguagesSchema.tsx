import mongoose from 'mongoose';

const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Language || mongoose.model('Language', LanguageSchema);