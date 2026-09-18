const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    applyLink: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Indexes for fast filtering
jobSchema.index({ category: 1 }); // filter by opportunity type
jobSchema.index({ country: 1 }); // filter by country
jobSchema.index({ company: 1 }); // filter/search by company

// Text index for search across title, company, description
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);