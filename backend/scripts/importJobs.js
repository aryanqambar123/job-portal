require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Job = require('../models/Job');

// List all CSV files to import here
const CSV_FILES = ['jobs_set1.csv', 'jobs_set2.csv', 'jobs_set3.csv'];

// Basic URL validator (used to catch bad apply_link values)
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

async function importJobs() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected. Starting import...\n');

    // 2. Clear existing jobs (avoids duplicates if we re-run the script)
    const existingCount = await Job.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing jobs — clearing them before re-import...`);
      await Job.deleteMany({});
    }

    let totalValid = 0;
    let totalSkipped = 0;
    const seen = new Set(); // tracks title+company+country to avoid duplicates across files

    for (const fileName of CSV_FILES) {
      const filePath = path.join(__dirname, '../data', fileName);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found, skipping: ${filePath}`);
        continue;
      }

      console.log(`\nReading file: ${fileName}`);

      const rows = await readCsvFile(filePath);
      const validJobs = [];

      rows.forEach((row, index) => {
        const rowNumber = index + 2; // +2 accounts for header row + 0-index

        const title = (row.title || '').trim();
        const company = (row.company || '').trim();
        const category = (row.category || '').trim();
        const country = (row.country || '').trim();
        const applyLink = (row.apply_link || '').trim();
        const description = (row.description || '').trim();

        // Validate required fields
        if (!title || !company || !category || !country || !applyLink || !description) {
          console.log(`  ✗ Skipping row ${rowNumber}: missing required field(s)`);
          totalSkipped++;
          return;
        }

        // Validate the apply link is a real URL
        if (!isValidUrl(applyLink)) {
          console.log(`  ✗ Skipping row ${rowNumber}: invalid apply_link "${applyLink}"`);
          totalSkipped++;
          return;
        }

        // Skip duplicates (same title + company + country)
        const dedupeKey = `${title.toLowerCase()}|${company.toLowerCase()}|${country.toLowerCase()}`;
        if (seen.has(dedupeKey)) {
          console.log(`  ✗ Skipping row ${rowNumber}: duplicate job "${title}" at "${company}"`);
          totalSkipped++;
          return;
        }
        seen.add(dedupeKey);

        validJobs.push({ title, company, category, country, applyLink, description });
      });

      // Insert this file's valid jobs
      if (validJobs.length > 0) {
        await Job.insertMany(validJobs);
        totalValid += validJobs.length;
        console.log(`  ✓ Imported ${validJobs.length} jobs from ${fileName}`);
      }
    }

    console.log('\n----------------------------------');
    console.log(`Import complete!`);
    console.log(`Total jobs imported: ${totalValid}`);
    console.log(`Total rows skipped: ${totalSkipped}`);
    console.log('----------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
}

// Helper: reads a CSV file and returns an array of row objects
function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

importJobs();