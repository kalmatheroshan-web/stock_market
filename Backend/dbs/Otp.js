const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema(
  {
    // ---------- Target user ----------
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    // ---------- OTP code ----------
    otp: {
      type: String,
      required: true,
      // Store as hashed for extra security (optional but recommended)
    },
    // ---------- Purpose ----------
    purpose: {
      type: String,
      enum: ['verify_email', 'reset_password', '2fa', 'transaction_confirm'],
      required: true,
      default: 'verify_email',
    },
    // ---------- Expiry ----------
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index – auto‑delete after expiry
    },
    // ---------- Attempts tracking ----------
    attempts: {
      type: Number,
      default: 0,
      max: 5, // block after too many failed attempts
    },
    // ---------- Metadata ----------
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Optional: IP or user agent for extra logging
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true, // automatically add createdAt & updatedAt
  }
);

// ---------- TTL Index: automatically remove expired documents ----------
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ---------- Pre‑save: hash OTP (optional but recommended) ----------
const bcrypt = require('bcryptjs');

otpSchema.pre('save', async function (next) {
  // Only hash if OTP is modified or new
  if (!this.isModified('otp')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ---------- Instance method: compare plain OTP with stored hash ----------
otpSchema.methods.compareOtp = async function (plainOtp) {
  return bcrypt.compare(plainOtp, this.otp);
};

// ---------- Static method: generate a new OTP ----------
otpSchema.statics.generateOtp = function (length = 6) {
  // Numeric OTP
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

// ---------- Static method: create a new OTP document ----------
otpSchema.statics.createOtp = async function ({
  email,
  purpose = 'verify_email',
  expiresInMinutes = 10,
  ipAddress,
  userAgent,
}) {
  // Delete any existing OTP for same email & purpose (optional)
  await this.deleteMany({ email, purpose });

  const plainOtp = this.generateOtp();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const otpDoc = new this({
    email,
    otp: plainOtp, // will be hashed in pre‑save
    purpose,
    expiresAt,
    ipAddress,
    userAgent,
  });

  await otpDoc.save();

  // Return the plain OTP (to send via email/SMS) and the document
  return { otp: plainOtp, doc: otpDoc };
};

// ---------- Create Model ----------
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;