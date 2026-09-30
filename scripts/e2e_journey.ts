import { AdvisoryRequestInput } from '../shared/schemas/advisory.js';

const BASE_URL = 'http://localhost:5000/api';

async function runE2E() {
  console.log('🌱 Starting Full-Stack E2E Journey Test against live server at http://localhost:5000...');

  // 1. Health check
  console.log('\n[1] Checking /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log('Health Response:', health);
  if (health.status !== 'ok') throw new Error('Health check failed');

  // 2. Register User A
  const emailA = `elena_test_${Date.now()}@agriadvisory.org`;
  console.log(`\n[2] Registering User A (${emailA})...`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Elena Rostova',
      email: emailA,
      password: 'SecurePassword123!',
      preferredLanguage: 'English',
    }),
  });
  const regData = await regRes.json();
  console.log('User A registered:', regData.success, regData.data.user.id);
  const tokenA = regData.data.token;
  const userAId = regData.data.user.id;

  // 3. User A Dashboard Stats initially
  console.log('\n[3] Fetching initial dashboard stats for User A...');
  const statsRes1 = await fetch(`${BASE_URL}/advisories/stats`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const statsData1 = await statsRes1.json();
  console.log('Initial Stats:', statsData1.data);
  if (statsData1.data.totalAdvisories !== 0) throw new Error('Initial count should be 0');

  // 4. Create Advisory for Tomato (Blight Scenario)
  console.log('\n[4] Submitting detailed crop advisory for Tomato...');
  const sampleTomato: AdvisoryRequestInput = {
    cropCategory: 'Vegetables',
    cropName: 'Tomato',
    cropVariety: 'Roma VF',
    growthStage: 'Flowering',
    location: 'Salinas Valley, California',
    stateRegion: 'California',
    country: 'United States',
    cultivatedArea: 2.5,
    soilType: 'Clay loam',
    soilPh: 6.6,
    soilMoisture: 'Moderately Moist / Optimal',
    organicMatterStatus: 'Moderate (2.5%)',
    soilTestInformation: 'Standard NPK conducted 4 months ago, adequate potassium',
    irrigationMethod: 'Drip',
    irrigationFrequency: 'Twice weekly, 4 hours per cycle',
    waterAvailability: 'Adequate / Scheduled',
    lastIrrigationAt: '2 days ago',
    recentRainfall: 'Light misting last weekend, 5mm',
    temperature: 'Warm days (27°C) with cool nights (14°C)',
    humidity: 'High morning humidity (75-80%)',
    weatherObservations: 'Heavy morning dew persisting until 10 AM',
    unusualWeather: 'Unseasonably overcast for late spring',
    visibleSymptoms: 'Dark brown, concentric ring lesions on lower mature foliage. Mild leaf yellowing and premature leaf drop.',
    affectedPlantParts: 'Lower canopy leaves and stems',
    affectedPercentage: 15,
    symptomDuration: 'First noticed 6 days ago, gradually spreading upwards',
    pestObservations: 'No visible aphids or whiteflies on leaf undersides',
    diseaseObservations: 'Suspected fungal leaf blight',
    weedObservations: 'Minor purslane between raised beds',
    fertilizersUsed: 'Drip-applied calcium nitrate (15.5-0-0) 10 days ago',
    pesticidesUsed: 'None in the current crop cycle',
    organicInputs: 'Composted dairy manure applied pre-transplant',
    previousTreatments: 'None',
    problemDescription: 'Dark concentric spots are appearing on lower foliage and working their way up the plants. Blossoms are still setting well, but leaves are yellowing and dropping around the base.',
  };

  const createRes = await fetch(`${BASE_URL}/advisories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify(sampleTomato),
  });
  const createData = await createRes.json();
  console.log('Advisory Created:', createData.success);
  console.log('Category:', createData.data.result.category);
  console.log('Severity:', createData.data.result.severity);
  console.log('Confidence:', createData.data.result.confidence);
  console.log('Immediate Actions:', createData.data.result.immediate_actions.length);
  console.log('Expert Escalation:', createData.data.result.expert_escalation.slice(0, 80) + '...');

  const advisoryId = createData.data.request.id;
  const resultId = createData.data.result.id;

  // 5. Fetch Advisory by ID
  console.log(`\n[5] Fetching advisory by ID (${advisoryId})...`);
  const getRes = await fetch(`${BASE_URL}/advisories/${advisoryId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const getData = await getRes.json();
  console.log('Fetched Advisory successfully:', getData.data.request.crop_name, getData.data.result.severity);

  // 6. Submit feedback
  console.log('\n[6] Submitting farmer rating & feedback...');
  const fbRes = await fetch(`${BASE_URL}/advisories/${resultId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      rating: 5,
      feedback: 'Very thorough recommendations. Guided me to check leaf undersides before chemical spray.',
    }),
  });
  const fbData = await fbRes.json();
  console.log('Feedback submitted:', fbData.success, 'Rating:', fbData.data.rating);

  // 7. Check Dashboard Stats after creation
  console.log('\n[7] Re-checking Dashboard Stats...');
  const statsRes2 = await fetch(`${BASE_URL}/advisories/stats`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const statsData2 = await statsRes2.json();
  console.log('Updated Stats:', statsData2.data);
  if (statsData2.data.totalAdvisories !== 1) throw new Error('Total advisories should be 1');
  if (statsData2.data.cropsAnalyzed !== 1) throw new Error('Crops analyzed should be 1');

  // 8. Register User B and verify Data Isolation
  const emailB = `user_b_${Date.now()}@agriadvisory.org`;
  console.log(`\n[8] Registering User B (${emailB}) for security isolation check...`);
  const regBRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Another Farmer',
      email: emailB,
      password: 'Password999!',
      preferredLanguage: 'English',
    }),
  });
  const regBData = await regBRes.json();
  const tokenB = regBData.data.token;

  console.log('User B attempting to read User A advisory...');
  const breachRes = await fetch(`${BASE_URL}/advisories/${advisoryId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log('User B access status:', breachRes.status, '(Expected 404 - Access Denied)');
  if (breachRes.status !== 404) throw new Error('Security Breach: User B accessed User A advisory!');

  console.log('User B attempting to delete User A advisory...');
  const delBreachRes = await fetch(`${BASE_URL}/advisories/${advisoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log('User B delete status:', delBreachRes.status, '(Expected 404 - Access Denied)');
  if (delBreachRes.status !== 404) throw new Error('Security Breach: User B deleted User A advisory!');

  console.log('\n✅ ALL E2E ENDPOINTS AND SECURITY CHECKS PASSED WITH FLYING COLORS!');
}

runE2E().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
