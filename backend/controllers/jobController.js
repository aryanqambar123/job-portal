const Job = require('../models/Job');

// Only accept plain strings for filter/search values.
// Prevents NoSQL injection via query params like ?country[$ne]=null
function sanitizeStringParam(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

// GET /api/jobs
// Supports: search, category, country, company, page, limit
exports.getJobs = async (req, res) => {
  try {
    const search = sanitizeStringParam(req.query.search);
    const category = sanitizeStringParam(req.query.category);
    const country = sanitizeStringParam(req.query.country);
    const company = sanitizeStringParam(req.query.company);

    const page = req.query.page;
    const limit = req.query.limit;

    // Validate page and limit
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Invalid limit (must be 1-100)' });
    }

    // Build MongoDB filter object (only ever plain strings, never client-controlled objects)
    const filter = {};
    if (category) filter.category = category;
    if (country) filter.country = country;
    if (company) filter.company = company;
    if (search) {
      // Use the text index we created on title, company, description
      filter.$text = { $search: search };
    }

    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalJobs / limitNum), 1);

    let jobs = [];
    if (pageNum <= totalPages) {
      jobs = await Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    }

    res.json({
      jobs,
      totalJobs,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format before querying
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error.message);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
};

// GET /api/jobs/countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Job.distinct('country');
    res.json(countries.sort());
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ message: 'Server error while fetching countries' });
  }
};

// GET /api/jobs/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Job.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// GET /api/jobs/companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Job.distinct('company');
    res.json(companies.sort());
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({ message: 'Server error while fetching companies' });
  }
};
