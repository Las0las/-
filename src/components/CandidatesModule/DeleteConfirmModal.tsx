import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { DeleteConfirmation, Candidate } from '../../types';

interface DeleteConfirmModalProps {
  confirmation: DeleteConfirmation | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal for confirming delete/archive actions
 */
export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  confirmation,
  onConfirm,
  onCancel,
}) => {
  if (!confirmation) return null;

  const { type, item } = confirmation;
  const candidate = item as Candidate;
  const isArchived = candidate.status === 'archived';

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-white">
              {isArchived ? 'Permanently Delete Candidate' : 'Archive Candidate'}
            </h3>
            <p className="text-sm text-gray-400">
              {isArchived ? 'This action cannot be undone' : 'This can be reversed later'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p id="modal-description" className="text-gray-300">
            {isArchived ? (
              <>
                Are you sure you want to{' '}
                <strong className="text-red-400">permanently delete</strong>{' '}
                <strong>
                  {candidate.firstName} {candidate.lastName}
                </strong>
                ? All associated data will be removed.
              </>
            ) : (
              <>
                Are you sure you want to archive{' '}
                <strong>
                  {candidate.firstName} {candidate.lastName}
                </strong>
                ? The candidate will be moved to archived but can be restored later.
              </>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isArchived ? 'Permanently Delete' : 'Archive Candidate'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
