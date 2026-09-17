import React, { useState } from 'react';
import { Plus, Search, FileText, MoreHorizontal, X, BookOpen } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; category: string; content: string } | null>(null);

  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Emergency Procedures');

  const [docs, setDocs] = useState([
    {
      id: 'DOC-1',
      title: 'Emergency Fall Protocol v2',
      category: 'Emergency Procedures',
      updated: 'Sep 10, 2025',
      content: `## 1. Trigger Criteria
- Impact shock peak vector acceleration exceeds 2.8g.
- Post-impact movement index < 0.08g sustained for > 3.0 seconds.

## 2. Immediate Triage (0-15 seconds)
1. Initiate tactile buzzer vibration on wearer device.
2. Synthesize audio chime prompt: "Fall detected. Are you okay?"
3. Await manual button confirmation ("I'm OK").

## 3. Escalation Rules
- If no user response within 15 seconds, trigger Deterministic Emergency Escalation.
- Dispatch SMS alert with GPS coordinates to primary caregiver.
- Queue automated voice alert to emergency contacts.`
    },
    {
      id: 'DOC-2',
      title: 'Caregiver Response Guide',
      category: 'Caregiver Instructions',
      updated: 'Sep 05, 2025',
      content: `## Caregiver Incident Response Guidelines
1. Call wearer immediately to assess responsiveness.
2. Check real-time GPS location coordinates in FallGuard AI dashboard.
3. If non-responsive, contact local emergency dispatch (112 / 911).
4. Verify whether wearer has baseline mobility impairments.`
    },
    {
      id: 'DOC-3',
      title: 'Device Troubleshooting',
      category: 'Device Instructions',
      updated: 'Aug 28, 2025',
      content: `## MPU-6050 & ESP32 Hardware Diagnostics
- **Battery Low (< 20%)**: Device emits slow red pulse. Place on magnetic charging cradle.
- **WiFi Disconnected**: Circular buffer preserves up to 500 samples in volatile RAM.
- **IMU Drift**: Recalibrate on a flat stationary surface for 5 seconds.`
    },
    {
      id: 'DOC-4',
      title: 'Fall Risk Assessment',
      category: 'Clinical Guidelines',
      updated: 'Aug 15, 2025',
      content: `## Clinical Fall Risk Stratification
- **High Risk**: Age > 75, history of syncope, gait velocity < 0.8 m/s.
- **Moderate Risk**: Previous stumble in past 30 days.
- **Recommendation**: Enable 100 Hz high-frequency monitoring mode.`
    },
    {
      id: 'DOC-5',
      title: 'User Manual - FallGuard',
      category: 'Device Documentation',
      updated: 'Aug 10, 2025',
      content: `## FallGuard AI Wearable User Manual
- Wear snugly on non-dominant wrist.
- Single tap on physical side-button cancels accidental false alarms.
- Battery lasts 48 hours on continuous BLE/WiFi streaming.`
    },
  ]);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;
    setDocs([
      ...docs,
      {
        id: `DOC-${docs.length + 1}`,
        title: docTitle,
        category: docCategory,
        updated: 'Just now',
        content: `## ${docTitle}\n\nClinical guidelines and operational instructions ingested into ChromaDB RAG vector store.`
      },
    ]);
    setShowAddModal(false);
    setDocTitle('');
  };

  const filtered = docs.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* Header matching Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search protocols, guidelines and documents</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Emergency Procedures">Emergency Procedures</option>
              <option value="Caregiver Instructions">Caregiver Instructions</option>
              <option value="Device Instructions">Device Instructions</option>
              <option value="Clinical Guidelines">Clinical Guidelines</option>
              <option value="Device Documentation">Device Documentation</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none">
              <option>All Types</option>
              <option>PDF Protocol</option>
              <option>Markdown</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Updated</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelectedDoc(d)}
                  className="hover:bg-slate-50 transition cursor-pointer group"
                >
                  <td className="py-3 font-medium text-slate-800 flex items-center gap-2 group-hover:text-blue-600">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>{d.title}</span>
                  </td>
                  <td className="py-3 text-slate-600">{d.category}</td>
                  <td className="py-3 text-slate-400 font-mono">{d.updated}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(d);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Reader Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {selectedDoc.category}
                </span>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedDoc.content}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Indexed in ChromaDB vector store</span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Clinical / Emergency Document</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Post-Fall Rehabilitation Protocol"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option>Emergency Procedures</option>
                  <option>Caregiver Instructions</option>
                  <option>Clinical Guidelines</option>
                  <option>Device Instructions</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-xs"
                >
                  Ingest into RAG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
