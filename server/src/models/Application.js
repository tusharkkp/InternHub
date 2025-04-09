const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internship: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Applied',
    },
    resumeUrl: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    additionalInfo: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
ApplicationSchema.index({ user: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema); 