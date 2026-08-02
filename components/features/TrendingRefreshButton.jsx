"use client";

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function TrendingRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleRefresh = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/trending', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setMessage(`Refreshed ${data.count} trending topics (${data.timePeriod})`);
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to refresh trending topics');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred while refreshing');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-error'}`}>
          {message}
        </span>
      )}
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-button text-sm font-semibold hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Refreshing...' : 'Refresh Trending'}
      </button>
    </div>
  );
}
