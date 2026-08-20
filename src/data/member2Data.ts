import type {
  ComparisonRow,
  CommonFact,
  DifferenceItem,
  InvestigationSummary,
} from '@/types';

export const comparisonRows: ComparisonRow[] = [
  {
    topic: 'Number of Suspects',
    values: {
      'Marcus Chen': 'Two men',
      'Elena Rodriguez': 'Two guys',
      'James Whitfield': 'Two guys',
      'Priya Nair': 'Two people',
    },
    classification: 'common',
    note: 'All four witnesses independently confirm two suspects.',
  },
  {
    topic: 'Suspect 1 Clothing',
    values: {
      'Marcus Chen': 'Dark hoodie, blue bandana over face',
      'Elena Rodriguez': 'Hoodie, blue face covering',
      'James Whitfield': 'Dark hoodie',
      'Priya Nair': 'Not observed',
    },
    classification: 'common',
    note: 'Three witnesses corroborate dark hoodie and blue face covering.',
  },
  {
    topic: 'Suspect 2 Clothing',
    values: {
      'Marcus Chen': 'Red baseball cap, black jacket',
      'Elena Rodriguez': 'Red hat',
      'James Whitfield': 'Red cap',
      'Priya Nair': 'Not observed',
    },
    classification: 'common',
    note: 'Red cap corroborated across three witnesses.',
  },
  {
    topic: 'Time of Entry',
    values: {
      'Marcus Chen': 'Approximately 21:15',
      'Elena Rodriguez': 'Shortly before 21:15',
      'James Whitfield': 'Around 21:15 (exit observed)',
      'Priya Nair': 'Around 21:10 (heard voices)',
    },
    classification: 'difference',
    note: 'Priya Nair estimates ~5 minutes earlier but expresses uncertainty. Others converge on 21:15.',
  },
  {
    topic: 'Direction of Flight',
    values: {
      'Marcus Chen': 'Left alley beside building',
      'Elena Rodriguez': 'Turned right after exiting',
      'James Whitfield': 'North on 5th Avenue',
      'Priya Nair': 'North on 5th Avenue',
    },
    classification: 'contradiction',
    note: 'Store owner says left alley; customer says right; taxi driver and pharmacist say north. May be reconcilable if alley connects to northbound street.',
  },
  {
    topic: 'Getaway Vehicle',
    values: {
      'Marcus Chen': 'Not observed',
      'Elena Rodriguez': 'Not observed',
      'James Whitfield': 'Dark sedan, Honda/Toyota, early 2000s, partial plate K/R + 7',
      'Priya Nair': 'Dark-colored car, make unknown',
    },
    classification: 'difference',
    note: 'Two witnesses agree on dark color. Only taxi driver could identify make and partial plate.',
  },
  {
    topic: 'Presence of Firearm',
    values: {
      'Marcus Chen': 'Silver handgun, clearly visible',
      'Elena Rodriguez': 'Did not see a weapon',
      'James Whitfield': 'Did not see a weapon',
      'Priya Nair': 'Did not see a weapon',
    },
    classification: 'difference',
    note: 'Only the store owner saw the firearm. Others were positioned behind aisles or outside — consistent with their vantage points, not a true contradiction.',
  },
  {
    topic: 'Items Stolen',
    values: {
      'Marcus Chen': 'Cash + 4-5 cigarette cartons',
      'Elena Rodriguez': 'Not observed (was hiding)',
      'James Whitfield': 'Not observed (exterior)',
      'Priya Nair': 'Not observed (adjacent building)',
    },
    classification: 'common',
    note: 'Only the store owner could confirm stolen items. No witness contradicts this account.',
  },
];

export const commonFacts: CommonFact[] = [
  {
    id: 'cf-001',
    caseId: 'case-001',
    category: 'Number of Suspects',
    description: 'Two male suspects involved in the robbery',
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield', 'Priya Nair'],
    status: 'consistent',
  },
  {
    id: 'cf-002',
    caseId: 'case-001',
    category: 'Suspect 1 Appearance',
    description: 'Tall suspect wearing a dark hoodie with a blue face covering',
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield'],
    status: 'consistent',
  },
  {
    id: 'cf-003',
    caseId: 'case-001',
    category: 'Suspect 2 Appearance',
    description: 'Shorter suspect wearing a red baseball cap',
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield'],
    status: 'consistent',
  },
  {
    id: 'cf-004',
    caseId: 'case-001',
    category: 'Flight Direction (Northbound)',
    description: 'Suspects ultimately fled north on 5th Avenue in a dark vehicle',
    witnesses: ['James Whitfield', 'Priya Nair'],
    status: 'consistent',
  },
];

export const differences: DifferenceItem[] = [
  {
    id: 'df-001',
    caseId: 'case-001',
    category: 'Time of Incident',
    witnessClaims: [
      { witnessName: 'Marcus Chen', claim: 'Approximately 21:15' },
      { witnessName: 'Priya Nair', claim: 'Around 21:10, possibly earlier' },
    ],
    severity: 'low',
    status: 'requires_verification',
    note: '5-minute discrepancy. Priya Nair explicitly expressed uncertainty about timing.',
  },
  {
    id: 'df-002',
    caseId: 'case-001',
    category: 'Getaway Vehicle Details',
    witnessClaims: [
      { witnessName: 'James Whitfield', claim: 'Dark sedan, Honda/Toyota, early 2000s, partial plate K/R + 7' },
      { witnessName: 'Priya Nair', claim: 'Dark-colored car, make unknown' },
    ],
    severity: 'medium',
    status: 'requires_verification',
    note: 'Both agree on dark color. Pharmacist could not identify make — consistent with her vantage point.',
  },
  {
    id: 'df-003',
    caseId: 'case-001',
    category: 'Firearm Visibility',
    witnessClaims: [
      { witnessName: 'Marcus Chen', claim: 'Silver handgun clearly visible and pointed at him' },
      { witnessName: 'Elena Rodriguez', claim: 'Did not see a weapon, only heard yelling' },
    ],
    severity: 'low',
    status: 'requires_verification',
    note: 'Not a true contradiction. Elena was behind an aisle with obstructed view. Her inability to see the firearm is consistent with her position.',
  },
];

export const investigationSummary: InvestigationSummary = {
  caseId: 'case-001',
  summary:
    'All four witnesses consistently reported two male suspects — a tall suspect in a dark hoodie with a blue face covering and a shorter suspect wearing a red baseball cap. The suspects entered Hartwell Convenience Store at approximately 21:15, brandished a firearm (confirmed by the store owner), stole cash and cigarette cartons, and fled the scene in a dark sedan heading north on 5th Avenue. However, witnesses provided different accounts of the exact flight direction from the store entrance (left alley vs. turned right vs. northbound), and the pharmacist estimated the incident occurred approximately 5 minutes earlier than other witnesses. Vehicle information should be verified using available CCTV and ANPR camera footage along 5th Avenue. The partial license plate (starts with K or R, contains a 7) is the strongest lead for vehicle identification.',
  keyAgreements: [
    'Two male suspects were involved',
    'Suspect 1: tall, dark hoodie, blue face covering',
    'Suspect 2: shorter, red baseball cap',
    'Incident occurred around 21:15 (3 of 4 witnesses)',
    'Getaway vehicle was dark-colored',
    'Suspects ultimately fled north on 5th Avenue',
  ],
  keyContradictions: [
    'Direction of flight from store: left alley (W1) vs. turned right (W2) vs. north (W3, W4)',
    'Time of incident: 21:15 (W1, W2, W3) vs. ~21:10 (W4)',
  ],
  missingInformation: [
    'Exact vehicle registration / full license plate',
    'Exact suspect ages and facial features (faces were covered)',
    'Suspect skin tone beyond hands (only W1 observed hands)',
    'Identity of the injured elderly customer (potential additional witness)',
    'Approach direction of suspects before entering the store',
    'CCTV footage from store and street cameras',
  ],
  recommendedVerification: [
    'Check CCTV footage from Hartwell Convenience Store and surrounding street cameras',
    'Verify vehicle information using ANPR cameras along northbound 5th Avenue',
    'Re-interview Elena Rodriguez with a floor plan to reconcile direction of flight discrepancy',
    'Locate and interview the injured elderly customer identified by Elena Rodriguez',
    'Sweep the left alley and vehicle entry point for discarded cigarette cartons (forensic trace)',
    'Cross-reference partial plate (K or R, contains 7) with vehicle registration database',
  ],
  generatedAt: '2024-11-15T02:00:00',
};
