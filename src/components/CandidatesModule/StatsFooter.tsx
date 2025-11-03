import React from 'react';
import { Download } from 'lucide-react';
import type { Candidate, Job, Submission, DashboardStats } from '../../types';

interface StatsFooterProps {
  stats: DashboardStats;
  candidates: Candidate[];
  jobs: Job[];
  submissions: Submission[];
}

/**
 * Footer component showing statistics and export functionality
 */
export const StatsFooter: React.FC<StatsFooterProps> = ({
  stats,
  candidates,
  jobs,
  submissions,
}) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(
      {
        candidates,
        jobs,
        submissions,
        exportDate: new Date().toISOString(),
        version: '2.0',
      },
      null,
      2
    );

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recruitment_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div>
            <span className="text-gray-400 text-sm">Total Candidates</span>
            <p className="text-white font-semibold">{stats.total}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Active</span>
            <p className="text-white font-semibold">{stats.active}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">This Week</span>
            <p className="text-white font-semibold">{stats.thisWeek}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Archived</span>
            <p className="text-white font-semibold">{stats.archived}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Export All Data"
            aria-label="Export all data as JSON"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
