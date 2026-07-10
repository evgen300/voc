import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  roles: {
    type: Array<String>
  },
  lang: {
    type: String
  },
  phone: {
    type: String
  }
}, { bufferCommands: false });

export default mongoose.models.User || mongoose.model('User', UserSchema);