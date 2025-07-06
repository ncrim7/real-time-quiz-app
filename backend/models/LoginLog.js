import mongoose from 'mongoose';

const LoginLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  userAgent: String,
  time: Date,
  location: String
});

const LoginLog = mongoose.model('LoginLog', LoginLogSchema);
export default LoginLog;
