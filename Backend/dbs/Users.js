const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ---------- Authentication ----------
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // exclude from queries by default
    },

    // ---------- Financial Profile ----------
    balance: {
      type: Number,
      default: 10000, // starting virtual cash
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP', 'JPY','INR'], // expand as needed
    },

    // ---------- Portfolio (holdings) ----------
    portfolio: [
      {
        symbol: {
          type: String,
          required: true,
          uppercase: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        averagePrice: {
          type: Number,
          required: true,
          min: 0,
        },
        // optional: last updated timestamp
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ---------- Watchlist ----------
    watchlist: [
      {
        symbol: {
          type: String,
          required: true,
          uppercase: true,
          trim: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ---------- Transaction History ----------
    transactions: [
      {
        type: {
          type: String,
          enum: ['buy', 'sell', 'deposit', 'withdraw'],
          required: true,
        },
        symbol: {
          type: String,
          uppercase: true,
          trim: true,
          // not required for deposits/withdrawals
        },
        quantity: {
          type: Number,
          min: 0,
        },
        price: {
          type: Number,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        // optional: reference to order/execution ID
        note: {
          type: String,
          trim: true,
        },
      },
    ],

    // ---------- Preferences ----------
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
      },
      // risk tolerance, etc.
    },

    // ---------- Timestamps & Security ----------
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For email verification, 2FA, etc.
    emailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ---------- Indexes for Performance ----------
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'portfolio.symbol': 1 });
userSchema.index({ 'watchlist.symbol': 1 });

// ---------- Pre-save Hook: Hash Password ----------
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function (next) {
  // Only hash if password is modified (or new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ---------- Instance Method: Compare Password ----------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---------- Create Model ----------
// Important: Use mongoose.model (not new)
const User = mongoose.model('User', userSchema);

module.exports = User;