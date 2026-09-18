import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import AdPlaceholder from '../components/AdPlaceholder';
import usePageTitle from '../hooks/usePageTitle';
import { getJobs, getCategories } from '../services/api';
import heroImage from '../assets/hero.png';

function Home() {
  usePageTitle('Find Your Next Opportunity');

  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [categoriesData, jobsData] = await Promise.all([
          getCategories(),
          getJobs({ page: 1, limit: 6 }),
        ]);
        setCategories(categoriesData);
        setFeaturedJobs(jobsData.jobs);
      } catch (err) {
        console.error(err);
        setError('Could not load jobs right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-text">
          <h1>Find Your Next Opportunity</h1>
          <p>Browse internships, fellowships, graduate programs, and more from top companies worldwide.</p>
          <SearchBar />
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Career opportunities" />
        </div>
      </section>

      <AdPlaceholder />

      <section className="categories-section">
        <h2>Popular Categories</h2>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/jobs?category=${encodeURIComponent(cat)}`}
                className="category-pill"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdPlaceholder />

      <section className="featured-section">
        <h2>Featured Jobs</h2>
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="job-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
        <div className="view-all-wrapper">
          <Link to="/jobs" className="view-all-btn">View All Jobs</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
