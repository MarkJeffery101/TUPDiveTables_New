export interface DecompressionRecord {
  'Depth(m/sw)': string;
  'BottomTime Min': string;
  'Time till(1st stop Min)': string;
  '24 Air': string;
  '21 Air': string;
  '18 Air': string;
  '15 Air TUP': string;
  '15Oxygen': string;
  '12 Air': string;
  '12Oxygen': string;
  '9 Air': string;
  '9Oxygen': string;
  '6 Air': string;
  '6Oxygen': string;
  '3 Air': string;
  '3Oxygen': string;
  'Total DecoTime Min': string;
  'TotalOTU': string;
  'TotalESOT': string;
  _flag: number | null;
}

export const EXPECTED_HEADERS: (keyof Omit<DecompressionRecord, '_flag'>)[] = [
  'Depth(m/sw)', 'BottomTime Min', 'Time till(1st stop Min)', '24 Air', '21 Air', '18 Air',
  '15 Air TUP', '15Oxygen', '12 Air', '12Oxygen', '9 Air', '9Oxygen', '6 Air', '6Oxygen',
  '3 Air', '3Oxygen', 'Total DecoTime Min', 'TotalOTU', 'TotalESOT'
];

export interface DiveInputs {
  maxDepth: string;
  o2: string;
  diveTime: string;
}

export interface DiveOutputs {
  bellDepth: string;
  po2: string;
  dmac: string;
  po2BgClass: string;
  bellmanEsot: string;
  diversEsot: string;
  bellmanOtu: string;
  diversOtu: string;
}

export interface SelfTestResult {
  passed: boolean;
  message: string;
}
