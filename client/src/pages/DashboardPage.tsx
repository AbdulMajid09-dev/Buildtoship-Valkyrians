import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats } from '@shared';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SeverityBadge } from '../components/ui/Badge';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import {
  Sprout,
  PlusCircle,
  History,
  AlertTriangle,
  Layers,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const data = await api.advisories.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Welcome back, {user?.fullName || 'Farmer'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your field intelligence, active crop advisories, and risk notifications.
          </p>
        </div>
        <div>
          <Link to="/app/advisory/new">
            <Button size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Get New Advisory
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert type="error" title="Dashboard Error">
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Advisories */}
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total Advisories
                </p>
                <h3 className="text-3xl font-extrabold text-stone-900 mt-1">
                  {stats?.totalAdvisories || 0}
                </h3>
                <p className="text-xs text-stone-400 mt-1">Cumulative crop diagnoses</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Crops Analyzed */}
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Crops Analyzed
                </p>
                <h3 className="text-3xl font-extrabold text-stone-900 mt-1">
                  {stats?.cropsAnalyzed || 0}
                </h3>
                <p className="text-xs text-stone-400 mt-1">Distinct crop varieties</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* High-Risk Advisories */}
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  High Risk Alerts
                </p>
                <h3 className="text-3xl font-extrabold text-stone-900 mt-1">
                  {stats?.highRiskCount || 0}
                </h3>
                <p className="text-xs text-stone-400 mt-1">Requiring immediate intervention</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Advisories Section */}
      <Card>
        <CardHeader
          title="Recent Crop Advisories"
          subtitle="Latest evaluations generated for your fields"
          action={
            <Link to="/app/advisories">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          }
        />
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" count={3} />
            </div>
          ) : !stats || stats.recentAdvisories.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-agri-50 text-agri-600 mx-auto flex items-center justify-center">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base font-bold text-stone-800">No crop advisories requested yet</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Submit observations about your crop symptoms, growth stage, and soil conditions to generate your first tailored advisory.
                </p>
              </div>
              <Link to="/app/advisory/new">
                <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Create First Advisory
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {stats.recentAdvisories.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{item.cropName}</span>
                      <span className="text-xs text-stone-500">({item.growthStage})</span>
                      <SeverityBadge severity={item.severity} />
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {item.situationSummary}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link to={`/app/advisories/${item.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
