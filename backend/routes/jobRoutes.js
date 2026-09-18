const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getCountries,
  getCategories,
  getCompanies,
} = require('../controllers/jobController');

// IMPORTANT: specific routes must come BEFORE the /:id route,
// otherwise "countries" would be treated as an :id value.
router.get('/countries', getCountries);
router.get('/categories', getCategories);
router.get('/companies', getCompanies);

router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;