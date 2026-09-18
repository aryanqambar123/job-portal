import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import AdPlaceholder from '../components/AdPlaceholder';
import { getJobs, getCountries, getCategories, getCompanies } from '../services/api';
import usePageTitle from '../hooks/usePageTitle';

function Jobs() {
  usePageTitle('Browse Jobs');
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [options, setOptions] = useState({ countries: [], categories: [], companies: [] });

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const filters = {
    search: searchParams.get('search') || '',
    country: searchParams.get('country') || '',
    category: searchParams.get('category') || '',
    company: searchParams.get('company') || '',
  };

  useEffect(() => {
    async function loadOptions() {
      try {
        const [countries, categories, companies] = await Promise.all([
          getCountries(),
          getCategories(),
          getCompanies(),
        ]);
        setOptions({ countries, categories, companies });
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setError('');
      try {
        const data = await getJobs({
          ...filters,
          page: currentPage,
          limit: 20,
        });
        setJobs(data.jobs);
        setTotalJobs(data.totalJobs);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setError('Could not load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    updateParams({ [key]: value });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="jobs-page">
      <div className="jobs-search-bar">
        <SearchBar
          initialValue={filters.search}
          onSearch={(value) => handleFilterChange('search', value)}
        />
      </div>

      <AdPlaceholder />

      <button
        className="mobile-filter-toggle"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="jobs-layout">
        <div className={`filter-wrapper ${showMobileFilters ? 'open' : ''}`}>
          <FilterSidebar
            filters={filters}
            options={options}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="jobs-results">
          <p className="results-count">
            {loading ? 'Loading...' : `${totalJobs} job${totalJobs !== 1 ? 's' : ''} found`}
          </p>

          {error && <p className="error-text">{error}</p>}

          {!loading && !error && jobs.length === 0 && (
            <p className="no-results">No jobs match your search. Try adjusting your filters.</p>
          )}

          <div className="job-list">
            {jobs.map((job, index) => (
              <div key={job._id}>
                <JobCard job={job} />
                {index === 4 && <AdPlaceholder />}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Jobs;