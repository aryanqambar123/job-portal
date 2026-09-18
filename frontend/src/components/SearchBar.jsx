import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// If onSearch is provided (e.g. from the Jobs page), it's used so existing
// filters/pagination in the URL are preserved instead of being wiped out.
// Otherwise (e.g. from the Home page) we navigate to /jobs with just the search term.
function SearchBar({ initialValue = '', onSearch }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    const params = new URLSearchParams();
    if (trimmed) params.set('search', trimmed);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by job title, company, or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
