import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


// ---------- Pre‑save: hash OTP (optional but recommended) ----------
otpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;

  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

// ---------- Instance method: compare plain OTP with stored hash ----------
otpSchema.methods.compareOtp = async function (plainOtp) {
  return await bcrypt.compare(plainOtp, this.otp);
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
  purpose = "verify_email",
  expiresInSeconds = 60,
  ipAddress,
  userAgent,
}) {
  await this.deleteMany({ email, purpose });

  const plainOtp = this.generateOtp();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  const otpDoc = new this({
    email,
    otp: plainOtp,
    purpose,
    expiresAt,
    ipAddress,
    userAgent,
  });

  await otpDoc.save();

  return { otp: plainOtp, doc: otpDoc };
};

// ---------- Create Model ----------
const Otp = mongoose.model('Otp', otpSchema);
export default Otp;