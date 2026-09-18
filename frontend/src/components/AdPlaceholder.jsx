function AdPlaceholder({ label = 'ADVERTISEMENT' }) {
  return (
    <div className="ad-placeholder">
      <span>{label}</span>
    </div>
  );
}

export default AdPlaceholder;