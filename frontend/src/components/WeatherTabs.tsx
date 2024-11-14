import React from 'react';

interface WeatherTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const WeatherTabs: React.FC<WeatherTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <ul className="nav nav-tabs mb-3 justify-content-end">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'day view' ? 'active' : ''}`}
          onClick={() => onTabChange('day view')}
        >
          Day View
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'temp chart' ? 'active' : ''}`}
          onClick={() => onTabChange('temp chart')}
        >
          Daily Temp Chart
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'meteogram' ? 'active' : ''}`}
          onClick={() => onTabChange('meteogram')}
        >
          Meteogram
        </button>
      </li>
    </ul>
  );
};

export default WeatherTabs;