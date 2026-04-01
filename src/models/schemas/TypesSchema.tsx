import mongoose from 'mongoose';

const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Type || mongoose.model('Type', TypeSchema);