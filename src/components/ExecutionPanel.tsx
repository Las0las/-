import React from 'react';
import { Play, Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ExecutionLog } from '../types';
import './ExecutionPanel.css';

interface ExecutionPanelProps {
  logs: ExecutionLog[];
  isExecuting: boolean;
  onExecute: () => void;
  onClearLogs: () => void;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  logs,
  isExecuting,
  onExecute,
  onClearLogs,
}) => {
  const getLogIcon = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'error':
        return <AlertCircle size={14} />;
      case 'warning':
        return <AlertTriangle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <div className="execution-panel">
      <div className="execution-header">
        <h3>Execution</h3>
        <div className="execution-actions">
          <button
            className="execute-button"
            onClick={onExecute}
            disabled={isExecuting}
          >
            <Play size={16} />
            {isExecuting ? 'Running...' : 'Run Workflow'}
          </button>
          <button className="clear-logs-button" onClick={onClearLogs}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="empty-logs">
            <Info size={24} />
            <p>No execution logs yet. Click "Run Workflow" to start.</p>
          </div>
        ) : (
          <div className="logs-list">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry log-${log.level}`}>
                <div className="log-header">
                  <span className="log-icon">{getLogIcon(log.level)}</span>
                  <span className="log-time">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="log-node">{log.nodeId}</span>
                </div>
                <div className="log-message">{log.message}</div>
                {log.data && (
                  <div className="log-data">
                    <pre>{JSON.stringify(log.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
