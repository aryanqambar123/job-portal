import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';
import { getJobById } from '../services/api';
import usePageTitle from '../hooks/usePageTitle';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageTitle(job ? job.title : 'Job Details');

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setError('');
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 404) {
          setError('This job could not be found. It may have been removed.');
        } else {
          setError('Something went wrong loading this job. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  if (loading) return <div className="job-details-page"><p>Loading job...</p></div>;

  if (error) {
    return (
      <div className="job-details-page">
        <p className="error-text">{error}</p>
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>

      <div className="job-details-card">
        <h1>{job.title}</h1>
        <div className="job-details-meta">
          <span>{job.company}</span>
          <span>•</span>
          <span>{job.country}</span>
          <span>•</span>
          <span className="job-category-tag">{job.category}</span>
        </div>

        <AdPlaceholder />

        <div className="job-details-section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <AdPlaceholder />

        <div className="apply-section">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-now-btn"
          >
            Apply Now →
          </a>
          <p className="apply-note">
            You will be redirected to {job.company}'s official application page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;