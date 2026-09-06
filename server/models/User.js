const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['citizen', 'admin', 'disaster_authority', 'response_team', 'field_officer'],
      default: 'citizen',
    },
    department: {
      type: String,
      default: 'GENERAL_PUBLIC',
    },
    subscription: {
      plan: {
        type: String,
        enum: ['none', 'tier1_basic', 'tier2_pro'],
        default: 'none',
      },
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired'],
        default: 'inactive',
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
    sosHistory: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        fullName: String,
        role: String,
        department: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
        message: String,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
