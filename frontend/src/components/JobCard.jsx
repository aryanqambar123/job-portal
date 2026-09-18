import { Link } from 'react-router-dom';

function JobCard({ job }) {
  const shortDescription =
    job.description.length > 120
      ? job.description.slice(0, 120) + '...'
      : job.description;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className="job-category">{job.category}</span>
      </div>
      <p className="job-company">{job.company}</p>
      <p className="job-country">{job.country}</p>
      <p className="job-description">{shortDescription}</p>
      <Link to={`/jobs/${job._id}`} className="view-job-btn">
        View Job
      </Link>
    </div>
  );
}

export default JobCard;