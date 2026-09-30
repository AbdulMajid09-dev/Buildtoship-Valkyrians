import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { SEVERITY_LEVELS } from '@shared';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SeverityBadge, ConfidenceBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import {
  History,
  Search,
  PlusCircle,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AdvisoriesPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdvisories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.advisories.list({
        page,
        limit,
        search: search.trim() || undefined,
        severity: severityFilter ? (severityFilter as any) : undefined,
      });
      setAdvisories(res.advisories);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load advisories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [page, severityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAdvisories();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.advisories.delete(deleteTargetId);
      setDeleteTargetId(null);
      await fetchAdvisories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete advisory.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <History className="w-6 h-6 text-agri-600" />
            Advisory History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review past agronomic evaluations, diagnosis notes, and monitoring records.
          </p>
        </div>
        <Link to="/app/advisory/new">
          <Button size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Advisory
          </Button>
        </Link>
      </div>

      {error && (
        <Alert type="error" title="Error loading advisories">
          {error}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by crop, location, or symptom description..."
                value={search}
                leftIcon={<Search className="w-4 h-4" />}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Severity Levels</option>
                {SEVERITY_LEVELS.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev} Severity
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="md" className="w-full">
                Apply Filters
              </Button>
              {(search || severityFilter) && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSearch('');
                    setSeverityFilter('');
                    setPage(1);
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advisories List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full" count={4} />
            </div>
          ) : advisories.length === 0 ? (
            <div className="py-20 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <History className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-bold text-base text-stone-800">No advisories found</h3>
                <p className="text-xs text-stone-500 mt-1">
                  {search || severityFilter
                    ? 'No records matched your search filters. Try adjusting your search term.'
                    : 'You have not submitted any crop advisories yet.'}
                </p>
              </div>
              <Link to="/app/advisory/new">
                <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Create Crop Advisory
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{adv.cropName}</span>
                      <span className="text-xs text-stone-500">({adv.growthStage})</span>
                      <SeverityBadge severity={adv.severity} />
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        {adv.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 max-w-3xl line-clamp-2 leading-relaxed">
                      {adv.situationSummary}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {adv.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(adv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link to={`/app/advisories/${adv.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        View Report
                      </Button>
                    </Link>
                    <button
                      onClick={() => setDeleteTargetId(adv.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete advisory record"
                      aria-label="Delete advisory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-stone-600">
          <div>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} advisories
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <span className="px-3 py-1 font-semibold text-stone-800">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Advisory Record"
        description="Are you sure you want to delete this agricultural advisory? This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-stone-600 leading-relaxed">
            All associated diagnoses, immediate action checklists, and farmer feedback for this specific inquiry will be permanently removed.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
