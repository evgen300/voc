import mongoose from 'mongoose';

interface WordFormInterface {
  word: string,
  transcription: string,
  translation: string,
  notes: string,
  audio: string
}

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  forms: Array<WordFormInterface>,
  notes: String,
  audio: String,
  categories: Array<String>,
  type_id: String,
  project_id: String
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema);