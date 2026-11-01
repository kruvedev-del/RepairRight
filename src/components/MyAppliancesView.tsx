import React, { useState } from 'react';
import { Cpu, Trash2, Copy, Check, ExternalLink, Plus, HardDrive, Info, AlertTriangle, Wrench } from 'lucide-react';
import { RepairCheckResult } from '../lib/safety';

export interface SavedApplianceRecord {
  id: string;
  applianceName: string;
  symptom: string;
  savedAt: string;
  summaryResult: RepairCheckResult;
}

interface MyAppliancesViewProps {
  savedRecords: SavedApplianceRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onStartRepairCheck: () => void;
}

export const MyAppliancesView: React.FC<MyAppliancesViewProps> = ({
  savedRecords,
  onDeleteRecord,
  onClearAll,
  onStartRepairCheck,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<SavedApplianceRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (record: SavedApplianceRecord) => {
    const text = `REPAIRRIGHT SAVED APPLIANCE RECORD
Appliance: ${record.applianceName}
Reported Issue: ${record.symptom}
Date Logged: ${new Date(record.savedAt).toLocaleDateString()}

Summary: ${record.summaryResult.summary}
Safe Checks:
${record.summaryResult.safe_checks.map((c, i) => `${i + 1}. ${c}`).join('\n')}
Uncertainty: ${record.summaryResult.uncertainty}
Next Step: ${record.summaryResult.next_step}`;

    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#70C8F4]/20 text-[#171635] text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Appliance Diagnostic Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold brand-font text-[#171635]">
              My Appliances
            </h1>
            <p className="text-xs sm:text-sm text-[#171635]/70 mt-1">
              Review your saved appliance summaries and safe check records.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {savedRecords.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
              >
                Clear all records
              </button>
            )}
            <button
              onClick={onStartRepairCheck}
              className="px-4 py-2.5 rounded-2xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start new check</span>
            </button>
          </div>
        </div>

        {/* Local Storage Disclaimer mandated by prompt */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#171635]/10 text-xs text-[#171635]/80 flex items-start gap-2.5">
          <HardDrive className="w-4 h-4 text-[#70C8F4] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#171635]">Local Prototype Storage: </span>
            Saved summaries are stored locally in your browser memory for this prototype session. There is no cloud sync or external database configured. You can delete items at any time.
          </div>
        </div>
      </div>

      {/* List of Saved Appliances */}
      {savedRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#171635]/10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FCFCFF] border border-[#171635]/15 text-[#171635] flex items-center justify-center mx-auto text-2xl">
            🫧
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold brand-font text-[#171635]">No saved appliances yet</h3>
            <p className="text-xs sm:text-sm text-[#171635]/60 max-w-sm mx-auto">
              Run a repair check or try the washing machine demo case to save a diagnostic summary card here.
            </p>
          </div>
          <button
            onClick={onStartRepairCheck}
            className="px-5 py-2.5 rounded-xl bg-[#171635] text-white font-bold text-xs hover:bg-[#171635]/90 transition"
          >
            Start a repair check
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#171635]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#70C8F4] transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#171635] bg-[#70C8F4]/20 px-2.5 py-0.5 rounded-full">
                    {rec.applianceName}
                  </span>
                  <span className="text-[11px] text-[#171635]/50">
                    Logged {new Date(rec.savedAt).toLocaleDateString()}
                  </span>
                  {rec.summaryResult.is_hazard && (
                    <span className="text-[10px] bg-[#FF4D8D] text-white font-bold px-2 py-0.5 rounded">
                      Hazard Flagged
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#171635]">{rec.symptom}</h3>
                <p className="text-xs text-[#171635]/80 line-clamp-2">
                  {rec.summaryResult.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3.5 py-2 rounded-xl bg-[#171635] text-white font-bold text-xs hover:bg-[#171635]/90 transition cursor-pointer"
                >
                  View summary
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(rec)}
                  className="p-2 rounded-xl border border-[#171635]/20 hover:bg-slate-50 text-[#171635] transition cursor-pointer"
                  title="Copy summary text"
                  aria-label="Copy summary text"
                >
                  {copiedId === rec.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRecord(rec.id)}
                  className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Delete local record"
                  aria-label="Delete local record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-[100000000] flex items-center justify-center p-4 bg-[#171635]/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#171635]/15 p-6 space-y-4 text-[#171635]">
            <div className="flex items-center justify-between pb-2 border-b border-[#171635]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#70C8F4]">
                  Saved Diagnostic Record
                </span>
                <h2 className="text-xl font-bold brand-font text-[#171635]">
                  {selectedRecord.applianceName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs font-bold text-[#171635]/70 hover:bg-slate-100 p-2 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FCFCFF] p-3 rounded-xl border border-[#171635]/10">
                <span className="font-bold text-[#171635] block mb-1">What you reported:</span>
                <p className="text-[#171635]/80">{selectedRecord.summaryResult.summary}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#171635] block">Safe non-invasive checks:</span>
                {selectedRecord.summaryResult.safe_checks.map((check, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded-lg text-[#171635]/90">
                    {i + 1}. {check}
                  </div>
                ))}
              </div>

              <div className="bg-[#171635] text-white p-3 rounded-xl space-y-1">
                <span className="font-bold text-[#FFD331] block">Recommended next step:</span>
                <p className="text-white/90">{selectedRecord.summaryResult.next_step}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => handleCopy(selectedRecord)}
                className="px-4 py-2 rounded-xl bg-[#FFD331] text-[#171635] font-bold text-xs"
              >
                {copiedId === selectedRecord.id ? 'Copied to clipboard' : 'Copy for technician'}
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-[#171635] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
