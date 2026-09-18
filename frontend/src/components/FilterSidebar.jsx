function FilterSidebar({ filters, options, onFilterChange, onClearFilters }) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-btn" onClick={onClearFilters}>Clear All</button>
      </div>

      <div className="filter-group">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={filters.country}
          onChange={(e) => onFilterChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {options.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category">Opportunity Type</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Types</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="company">Company</label>
        <select
          id="company"
          value={filters.company}
          onChange={(e) => onFilterChange('company', e.target.value)}
        >
          <option value="">All Companies</option>
          {options.companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default FilterSidebar;