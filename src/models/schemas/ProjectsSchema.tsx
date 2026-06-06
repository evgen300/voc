import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  language_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);