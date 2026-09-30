import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader
          icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
          title="Terms of Agricultural Advisory & Safety Disclaimers"
          subtitle="Conditions governing the use of AI agronomic decision-support"
        />
        <CardContent className="space-y-5 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">1. Advisory Decision-Support Only</h3>
            <p>
              AgriAdvisory AI provides diagnostic hypotheses, preventive cultural practices, and agronomic guidelines based solely on user-supplied information. It does not constitute a certified field agronomy audit or formal plant pathology diagnosis.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">2. Chemical and Pesticide Safety</h3>
            <p>
              Under no circumstances should recommendations from this platform replace official manufacturer pesticide/herbicide product labels or local agricultural regulatory mandates. Farmers must always verify chemical compatibility, pre-harvest intervals (PHI), and use mandatory Personal Protective Equipment (PPE).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">3. Local Agricultural Escalation</h3>
            <p>
              For widespread disease outbreaks, unexplained acute crop collapse, or high-risk economic infestations, users are required to seek on-site physical inspection by qualified local agricultural extension officers, certified crop advisors (CCA), or university pathology diagnostic labs.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-stone-900 text-base">4. No Yield or Recovery Guarantee</h3>
            <p>
              Agricultural yields depend on dynamic climatic, biological, and micro-environmental variables outside platform control. AgriAdvisory makes no warranty or guarantee of crop survival, yield recovery, or financial returns.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
