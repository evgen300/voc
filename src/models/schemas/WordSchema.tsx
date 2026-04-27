import mongoose from 'mongoose';

interface WordFormInterface {
  word: string,
  transcription: string,
  translation: string,
  notes: string,
  audio: string
};
interface VerbFormInterface {
  type: String,
  word: String,
  transcription: String,
  translation: String,
  notes: String
};

interface VerbTimeInterface {
  time: String,
  forms: Array<VerbFormInterface>
};

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  transcription: {
    type: String
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
  project_id: String,
  verb_times: Array<VerbTimeInterface>
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema);