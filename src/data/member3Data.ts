export interface EventConfidenceItem {
  id: string;
  event: string;
  category: string;
  confidence: number;
  witnessCount: number;
  witnesses: string[];
  reason: string;
  positiveFactors: string[];
  negativeFactors: string[];
}

export const eventConfidenceItems: EventConfidenceItem[] = [
  {
    id: 'ec-001',
    event: 'Number of Suspects (Two males)',
    category: 'Suspect Description',
    confidence: 98,
    witnessCount: 4,
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield', 'Priya Nair'],
    reason: 'Unanimously reported by all four witnesses with no variation in count.',
    positiveFactors: [
      'Reported by all four witnesses independently',
      'No conflicting accounts on suspect count',
      'Consistent across different vantage points (interior and exterior)',
    ],
    negativeFactors: [],
  },
  {
    id: 'ec-002',
    event: 'Suspect 1 Clothing (Dark hoodie, blue face covering)',
    category: 'Suspect Description',
    confidence: 92,
    witnessCount: 3,
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield'],
    reason: 'Consistently reported across independent witness statements from different positions.',
    positiveFactors: [
      'Reported by three independent witnesses',
      'Consistent description of blue face covering across accounts',
      'Corroborated from both interior and exterior vantage points',
    ],
    negativeFactors: [
      'Face covering limits facial identification',
    ],
  },
  {
    id: 'ec-003',
    event: 'Suspect 2 Clothing (Red baseball cap)',
    category: 'Suspect Description',
    confidence: 90,
    witnessCount: 3,
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield'],
    reason: 'Red cap is a distinctive detail corroborated by three witnesses.',
    positiveFactors: [
      'Distinctive clothing item (red cap) easily recalled',
      'Three witnesses independently confirm the same detail',
      'No witness contradicts this description',
    ],
    negativeFactors: [],
  },
  {
    id: 'ec-004',
    event: 'Time of Incident (~21:15)',
    category: 'Timeline',
    confidence: 78,
    witnessCount: 3,
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield'],
    reason: 'Three of four witnesses converge on 21:15. The fourth estimates ~21:10 with expressed uncertainty.',
    positiveFactors: [
      'Store owner anchored time to closing routine (strong time anchor)',
      'Three witnesses independently converge on the same time',
      '911 call timestamp provides corroboration',
    ],
    negativeFactors: [
      'Pharmacist estimates ~5 minutes earlier (self-reported uncertainty)',
      'Time estimates are approximate, not exact',
    ],
  },
  {
    id: 'ec-005',
    event: 'Presence of Firearm (Silver handgun)',
    category: 'Weapon Details',
    confidence: 85,
    witnessCount: 1,
    witnesses: ['Marcus Chen'],
    reason: 'Only the store owner directly observed the weapon, but his vantage point and proximity make this highly credible. Other witnesses not seeing it is consistent with their positions.',
    positiveFactors: [
      'Observed at close range (~2 meters) by the victim',
      'Store owner provided specific detail (silver, possibly Glock, tape on grip)',
      'Other witnesses not seeing it is consistent with obstructed views',
    ],
    negativeFactors: [
      'Only one witness directly observed the firearm',
      'Under duress — some detail accuracy may be affected',
    ],
  },
  {
    id: 'ec-006',
    event: 'Getaway Vehicle (Dark sedan)',
    category: 'Vehicle Identification',
    confidence: 65,
    witnessCount: 2,
    witnesses: ['James Whitfield', 'Priya Nair'],
    reason: 'Both witnesses agree on a dark-colored vehicle, but specific make and plate details come from a single witness with only ~60% certainty on the partial plate.',
    positiveFactors: [
      'Two witnesses independently confirm dark-colored vehicle',
      'Taxi driver has professional observation skills',
      'Partial plate provides a searchable parameter',
    ],
    negativeFactors: [
      'Vehicle make uncertain (Honda or Toyota)',
      'Partial plate only ~60% certain',
      'Pharmacist could not identify make or model',
      'No CCTV confirmation yet available',
    ],
  },
  {
    id: 'ec-007',
    event: 'Direction of Flight',
    category: 'Scene Reconstruction',
    confidence: 45,
    witnessCount: 4,
    witnesses: ['Marcus Chen', 'Elena Rodriguez', 'James Whitfield', 'Priya Nair'],
    reason: 'Witnesses provided conflicting descriptions of flight direction. This is the most significant contradiction in the case.',
    positiveFactors: [
      'Two witnesses agree on northbound direction on 5th Avenue',
      'Accounts may be reconcilable if left alley connects to northbound street',
    ],
    negativeFactors: [
      'Store owner says left alley; customer says right — direct conflict',
      'Different vantage points may cause perspective-based discrepancies',
      'Requires floor-plan walk-through to resolve',
      'No CCTV confirmation available yet',
    ],
  },
  {
    id: 'ec-008',
    event: 'Items Stolen (Cash + cigarette cartons)',
    category: 'Evidence',
    confidence: 82,
    witnessCount: 1,
    witnesses: ['Marcus Chen'],
    reason: 'Only the store owner could confirm stolen items, but his position behind the counter gives him direct knowledge. No witness contradicts this account.',
    positiveFactors: [
      'Direct observation by the victim behind the counter',
      'Specific quantity reported (4-5 cartons)',
      'No contradicting accounts from other witnesses',
    ],
    negativeFactors: [
      'Only one witness can confirm stolen items',
      'Exact count may be approximate under duress',
    ],
  },
];
