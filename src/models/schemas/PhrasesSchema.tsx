import mongoose from 'mongoose';

const PhraseSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  notes: String,
  audio: String,
  categories: Array<String>,
  project_id: String
});

export default mongoose.models.Phrase || mongoose.model('Phrase', PhraseSchema);