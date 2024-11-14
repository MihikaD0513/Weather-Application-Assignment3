import React from 'react';

const LoadingBar: React.FC = () => (
  <div className="progress mb-3 mt-5">
    <div
      className="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      style={{ width: '100%' }}
    />
  </div>
);

export default LoadingBar;