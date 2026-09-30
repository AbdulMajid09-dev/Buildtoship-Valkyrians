import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FullAdvisoryDetail } from '@shared';
import { AdvisoryResultView } from '../components/advisory/AdvisoryResultView';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import { ChevronLeft, ShieldAlert, History } from 'lucide-react';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<FullAdvisoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdvisory() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.advisories.getById(id);
        setAdvisory(data);
      } catch (err: any) {
        setError(
          err.status === 404 || err.status === 403
            ? 'Advisory not found or you do not have permission to view it.'
            : err.message || 'Failed to load advisory report.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAdvisory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Access Restricted or Not Found</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          {error || 'The requested advisory record could not be retrieved.'}
        </p>
        <div className="pt-2">
          <Link to="/app/advisories">
            <Button variant="outline" size="sm" leftIcon={<History className="w-4 h-4" />}>
              Back to Advisory History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <Link
          to="/app/advisories"
          className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-agri-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Advisory History
        </Link>
      </div>

      <AdvisoryResultView advisory={advisory} />
    </div>
  );
};
