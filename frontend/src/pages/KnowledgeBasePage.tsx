import React, { useState } from 'react';
import { Plus, Search, FileText, MoreHorizontal, X } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Emergency Procedures');

  const [docs, setDocs] = useState([
    { id: 'DOC-1', title: 'Emergency Fall Protocol v2', category: 'Emergency Procedures', updated: 'Sep 10, 2025' },
    { id: 'DOC-2', title: 'Caregiver Response Guide', category: 'Caregiver Instructions', updated: 'Sep 05, 2025' },
    { id: 'DOC-3', title: 'Device Troubleshooting', category: 'Device Instructions', updated: 'Aug 28, 2025' },
    { id: 'DOC-4', title: 'Fall Risk Assessment', category: 'Clinical Guidelines', updated: 'Aug 15, 2025' },
    { id: 'DOC-5', title: 'User Manual - FallGuard', category: 'Device Documentation', updated: 'Aug 10, 2025' },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search protocols, guidelines and documents</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        {/* Filters and search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Emergency Procedures">Emergency Procedures</option>
              <option value="Caregiver Instructions">Caregiver Instructions</option>
              <option value="Device Instructions">Device Instructions</option>
              <option value="Clinical Guidelines">Clinical Guidelines</option>
              <option value="Device Documentation">Device Documentation</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none">
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
                <tr key={d.id} className="hover:bg-slate-50 transition cursor-pointer">
                  <td className="py-3.5 font-medium text-slate-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>{d.title}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{d.category}</td>
                  <td className="py-3.5 text-slate-400 font-mono">{d.updated}</td>
                  <td className="py-3.5 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-sm"
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
