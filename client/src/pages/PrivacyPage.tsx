import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader
          icon={<ShieldCheck className="w-6 h-6 text-agri-600" />}
          title="Farmer Data Privacy Policy"
          subtitle="How AgriAdvisory AI protects your agricultural and geospatial data"
        />
        <CardContent className="space-y-5 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">1. Agricultural Telemetry Ownership</h3>
            <p>
              All field observations, soil records, crop symptoms, and farming practices uploaded to AgriAdvisory remain the exclusive intellectual and operational property of the contributing farmer. We do not sell or monetize individual farm yield or spatial data.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">2. Server-Side AI Processing</h3>
            <p>
              All interactions with Google Gemini AI are conducted strictly over encrypted server-to-server APIs. Farmer identities, email addresses, and passwords are never transmitted to third-party language models. Telemetry passed to the model includes solely the agronomic parameters necessary to formulate the advisory.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">3. Row-Level Data Isolation</h3>
            <p>
              Each advisory record is bound strictly to the authenticated farmer account. Users cannot view, enumerate, or modify records belonging to other farm holdings.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">4. Data Retention and Deletion</h3>
            <p>
              You have the right to delete your historical advisories and telemetry at any time through the Advisory History portal. Deleting an advisory removes all diagnoses, checklists, and feedback permanently.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
