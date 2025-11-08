import Tooltip from './Tooltip';
import { DiveInputs, DiveOutputs } from '../types';

interface InfoRowProps {
  label: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, tooltip, children }) => (
  <>
    <div className="flex items-center gap-2 text-text-dark">
      {label}
      <Tooltip tip={tooltip} />
    </div>
    <div>{children}</div>
  </>
);

interface InputOutputSectionProps {
  inputs: DiveInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  outputs: DiveOutputs;
}

const InputOutputSection: React.FC<InputOutputSectionProps> = ({ inputs, onInputChange, outputs }) => {
  const inputStyle = "w-full h-7 bg-gray-700 text-gray-100 border border-gray-600 rounded-md px-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";
  const outputStyle = "w-full h-7 flex items-center justify-end px-2 border border-gray-600 rounded-md bg-gray-900/50 text-gray-100 transition-colors duration-200";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mt-2">
      {/* Inputs Card */}
      <div className="bg-group-card-bg border border-border rounded-xl p-3">
        <h3 className="text-lg font-bold text-text-dark mb-2.5">Inputs</h3>
        <div className="grid grid-cols-[1fr_120px] gap-x-2 gap-y-2 items-center">
          <InfoRow label="Maximum Dive Depth" tooltip="Maximum planned depth in metres of seawater (msw) for this dive.">
            <input id="maxDepth" type="number" placeholder="msw" className={inputStyle} value={inputs.maxDepth} onChange={onInputChange} />
          </InfoRow>
          <InfoRow label="Nitrox O2%" tooltip="Fraction of oxygen in the breathing mix at depth (e.g., 32 for EAN32).">
            <input id="o2" type="number" step="0.1" placeholder="%" className={inputStyle} value={inputs.o2} onChange={onInputChange} />
          </InfoRow>
          <InfoRow label="Dive Time" tooltip="Planned bottom time in minutes (clock time at depth).">
            <input id="diveTime" type="number" step="0.1" placeholder="min" className={inputStyle} value={inputs.diveTime} onChange={onInputChange} />
          </InfoRow>
        </div>
      </div>

      {/* Outputs Card */}
      <div className="bg-group-card-bg border border-border rounded-xl p-3">
        <h3 className="text-lg font-bold text-text-dark mb-2.5">Outputs</h3>
        <div className="grid grid-cols-[1fr_120px] gap-x-2 gap-y-2 items-center">
          <InfoRow label="EAD Calculated, safety margin added, closest table bellow" tooltip="Deepest bell depth used for transfer/stop planning (Safety‑EAD).">
            <div className={outputStyle}>{outputs.bellDepth}</div>
          </InfoRow>
          <InfoRow label="PO2 at Diving Depth" tooltip="Calculated inspired oxygen partial pressure (bar) at the dive depth.">
            <div className={`${outputStyle} ${outputs.po2BgClass}`}>{outputs.po2}</div>
          </InfoRow>
          <InfoRow label="IMCA TUP Max Bottom Time" tooltip={<>IMCA/DMAC guidance: maximum allowable <strong>bottom time</strong> (minutes) for TUP at the entered depth. Snaps to the next listed deeper depth.</>}>
            <div className={outputStyle}>
              <span className="text-sm text-right leading-tight">{outputs.dmac}</span>
            </div>
          </InfoRow>
        </div>
      </div>
      
      <div className="col-span-full border-t border-dashed border-border mt-1" />

      {/* Bellman Exposure Card */}
      <div className="bg-group-card-bg border border-border rounded-xl p-3 mt-1">
        <h3 className="text-lg font-bold text-text-dark mb-2.5">Bellman's Exposure</h3>
        <div className="grid grid-cols-[1fr_120px] gap-x-2 gap-y-2 items-center">
            <InfoRow label="ESOT" tooltip="Equivalent Surface Oxygen Time (ESOT) for the Bellman.">
                <div className={outputStyle}>{outputs.bellmanEsot}</div>
            </InfoRow>
            <InfoRow label="OTU" tooltip="Oxygen Toxicity Units (OTU) for the Bellman.">
                <div className={outputStyle}>{outputs.bellmanOtu}</div>
            </InfoRow>
        </div>
      </div>

      {/* Diver Exposure Card */}
      <div className="bg-group-card-bg border border-border rounded-xl p-3 mt-1">
        <h3 className="text-lg font-bold text-text-dark mb-2.5">Diver's Exposure</h3>
        <div className="grid grid-cols-[1fr_120px] gap-x-2 gap-y-2 items-center">
            <InfoRow label="ESOT" tooltip="Equivalent Surface Oxygen Time (ESOT) for the Diver.">
                <div className={outputStyle}>{outputs.diversEsot}</div>
            </InfoRow>
            <InfoRow label="OTU" tooltip="Oxygen Toxicity Units (OTU) for the Diver.">
                <div className={outputStyle}>{outputs.diversOtu}</div>
            </InfoRow>
        </div>
      </div>
    </div>
  );
};

export default InputOutputSection;
