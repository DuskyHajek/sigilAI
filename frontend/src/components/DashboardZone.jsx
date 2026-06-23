const DashboardZone = ({ id, label, children, className = "" }) => (
  <section
    id={id}
    className={`dashboard-zone ${className}`.trim()}
    aria-labelledby={id ? `${id}-label` : undefined}
  >
    {label && (
      <h2 id={`${id}-label`} className="dashboard-zone__label">
        {label}
      </h2>
    )}
    <div className="dashboard-zone__content">{children}</div>
  </section>
);

export default DashboardZone;
