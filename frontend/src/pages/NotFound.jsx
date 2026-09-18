import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="view-all-btn">Back to Home</Link>
    </div>
  );
}

export default NotFound;
