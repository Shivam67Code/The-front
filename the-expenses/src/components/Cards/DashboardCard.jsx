import React from 'react';

const DashboardCard = ({ title, children, className, ...props }) => {
  return (
    <div 
      className={`card card-with-theme-animation ${className || ''}`}
      {...props}
    >
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};

export default DashboardCard;