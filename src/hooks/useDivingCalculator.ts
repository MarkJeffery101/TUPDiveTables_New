import { useState, useMemo, useCallback, useEffect } from 'react';
import { DiveInputs, DiveOutputs, DecompressionRecord, SelfTestResult } from '../types';
import { csvData } from '../data/csvData';
import {
  parseCSV, toRecords, round, getPO2BgClass, nextIMCADeeper,
  IMCA_TUP_LIMITS, filterByDepth, nextDATADeeper,
  calculateExposure, DECOMPRESSION_STOPS
} from '../utils/calculator';

const useDivingCalculator = () => {
  const [inputs, setInputs] = useState<DiveInputs>({ maxDepth: '', o2: '', diveTime: '' });
  const [outputs, setOutputs] = useState<DiveOutputs>({
    bellDepth: '', po2: '', dmac: '', po2BgClass: '',
    bellmanEsot: '', diversEsot: '', bellmanOtu: '', diversOtu: ''
  });
  const [filteredRecords, setFilteredRecords] = useState<DecompressionRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState('Dataset embedded');
  const [selfTestResult, setSelfTestResult] = useState<SelfTestResult>({ passed: false, message: 'Running self-tests…' });
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const { allRecords, dataDepths } = useMemo(() => {
    const rows = parseCSV(csvData.trim());
    const records = toRecords(rows);
    const depths = Array.from(new Set(records.map(r => parseFloat(r['Depth(m/sw)'])).filter(v => !isNaN(v))))
      .sort((a, b) => a - b);
    return { allRecords: records, dataDepths: depths };
  }, []);

  const runSelfTests = useCallback(() => {
    try {
      const sample = 'Depth(m/sw),BottomTime Min,Time till(1st stop Min)\n9,400,0.9\n15,200,0.6,,,,,,,,,,,,,,41.5,83,146,1\n';
      const parsed = parseCSV(sample);
      if (!(parsed.length >= 2)) throw new Error('CSV parse failed');
      const temp = toRecords(parsed);
      if (!(temp[1] && temp[1]._flag === 1)) throw new Error('Flag mapping failed');
      
      const synCSV = 'Depth(m/sw),BottomTime Min,Time till(1st stop Min)\n18,60,1.5\n19,60,1.3\n36,60,2.1\n';
      const testRecords = toRecords(parseCSV(synCSV));
      const testDepths = [18, 19, 36];

      let t = filterByDepth(18.5, testRecords, testDepths);
      if (!(t.usedDepth === 19 && t.snapped === true)) throw new Error('18.5→19 dataset snap failed');
      t = filterByDepth(33.4, testRecords, testDepths);
      if (!(t.usedDepth === 36 && t.snapped === true)) throw new Error('33.4→36 dataset snap failed');
      if (!(nextIMCADeeper(17) === 18 && nextIMCADeeper(22.1) === 23 && nextIMCADeeper(51) === 51 && nextIMCADeeper(55) === null)) throw new Error('IMCA helper failed');
      
      setSelfTestResult({ passed: true, message: 'Self-tests passed' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred';
      setSelfTestResult({ passed: false, message: `Self-tests failed: ${message}` });
    }
  }, []);

  useEffect(() => {
    runSelfTests();
    setFilteredRecords(allRecords);
    setStatusMessage(`Showing all ${allRecords.length} rows`);
  }, [allRecords, runSelfTests]);

  const compute = useCallback(() => {
    const depth = Number(inputs.maxDepth);
    const o2Pct = Number(inputs.o2);

    if (!Number.isFinite(depth) || depth <= 0 || !Number.isFinite(o2Pct) || o2Pct <= 0 || o2Pct >= 100) {
      setOutputs({ bellDepth: '', po2: '', dmac: '', po2BgClass: 'bg-transparent', bellmanEsot: '', diversEsot: '', bellmanOtu: '', diversOtu: '' });
      setFilteredRecords(allRecords);
      setStatusMessage(`Showing all ${allRecords.length} rows`);
      setSelectedRowIndex(null);
      return;
    }

    const FO2 = o2Pct / 100;
    const safetyEad = (((1 - FO2) / 0.775) * (depth + 10)) - 10;
    const po2AtDepth = FO2 * (depth / 10 + 1);
    const bellDepth = round(safetyEad, 1);

    const snap = nextIMCADeeper(depth);
    const limit = snap != null ? IMCA_TUP_LIMITS[snap] : null;
    const dmacText = limit ? `${limit} min @ ${snap} msw` : '—';
    
    const { rows, usedDepth, snapped } = filterByDepth(bellDepth, allRecords, dataDepths);
    setFilteredRecords(rows);

    const diveTimeNum = Number(inputs.diveTime);
    let newSelectedRowIndex: number | null = null;
    if (Number.isFinite(diveTimeNum) && diveTimeNum > 0) {
      const foundIndex = rows.findIndex(rec => Number(rec['BottomTime Min']) >= diveTimeNum);
      if (foundIndex !== -1) {
        newSelectedRowIndex = foundIndex;
      }
    }
    setSelectedRowIndex(newSelectedRowIndex);

    let bellmanEsot = '';
    let diversEsot = '';
    let bellmanOtu = '';
    let diversOtu = '';

    if (newSelectedRowIndex !== null) {
      const selectedRecord = rows[newSelectedRowIndex];
      let totalBellmanOtu = 0;
      let totalBellmanEsot = 0;
      let totalDiverOtu = 0;
      let totalDiverEsot = 0;

      const bottomTime = Number(selectedRecord['BottomTime Min']) || 0;
      const timeTillFirstStop = Number(selectedRecord['Time till(1st stop Min)']) || 0;
      const segment1Time = bottomTime + timeTillFirstStop;

      if (segment1Time > 0) {
        const diverExposure = calculateExposure(depth, o2Pct, segment1Time);
        totalDiverOtu += diverExposure.otu;
        totalDiverEsot += diverExposure.esot;

        const bellmanExposure = calculateExposure(bellDepth, 21, segment1Time);
        totalBellmanOtu += bellmanExposure.otu;
        totalBellmanEsot += bellmanExposure.esot;
      }

      DECOMPRESSION_STOPS.forEach(stop => {
        const stopTime = Number(selectedRecord[stop.column]) || 0;
        if (stopTime > 0) {
          const stopExposure = calculateExposure(stop.depth, stop.o2, stopTime);
          totalDiverOtu += stopExposure.otu;
          totalDiverEsot += stopExposure.esot;
          totalBellmanOtu += stopExposure.otu;
          totalBellmanEsot += stopExposure.esot;
        }
      });
      
      bellmanEsot = Math.round(totalBellmanEsot).toString();
      diversEsot = Math.round(totalDiverEsot).toString();
      bellmanOtu = Math.round(totalBellmanOtu).toString();
      diversOtu = Math.round(totalDiverOtu).toString();
    }

    setOutputs({
        bellDepth: bellDepth.toFixed(1),
        po2: round(po2AtDepth, 2).toFixed(2),
        po2BgClass: getPO2BgClass(po2AtDepth),
        dmac: dmacText,
        bellmanEsot,
        diversEsot,
        bellmanOtu,
        diversOtu,
    });

    if (usedDepth == null) {
      const hinted = nextDATADeeper(bellDepth, dataDepths);
      setStatusMessage(hinted != null
        ? `No table rows for bell depth ${bellDepth} msw; next dataset depth is ${hinted} msw but no rows exist.`
        : `No table for bell depth ${bellDepth} msw and no deeper dataset depth available.`);
    } else if (snapped) {
      setStatusMessage(`Bell depth ${bellDepth} msw → dataset ${usedDepth} msw (showing ${rows.length} row(s))`);
    } else {
      setStatusMessage(`Showing ${rows.length} row(s) for dataset depth ${usedDepth} msw`);
    }
  }, [inputs, allRecords, dataDepths]);

  useEffect(() => {
    compute();
  }, [inputs, compute]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleRowClick = useCallback((index: number) => {
    const record = filteredRecords[index];
    if (record) {
      setInputs(prev => ({ ...prev, diveTime: record['BottomTime Min'] }));
    }
  }, [filteredRecords]);

  return { inputs, handleInputChange, outputs, filteredRecords, statusMessage, selfTestResult, selectedRowIndex, handleRowClick };
};

export default useDivingCalculator;
