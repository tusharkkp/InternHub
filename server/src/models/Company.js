const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    industry: {
      type: String,
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    founded: {
      type: Number,
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', CompanySchema); 