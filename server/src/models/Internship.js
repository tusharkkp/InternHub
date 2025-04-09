const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InternshipSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    salary: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    skills: [
      {
        type: String,
      },
    ],
    applicantCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Filled', 'Expired'],
      default: 'Open',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Internship', InternshipSchema); 