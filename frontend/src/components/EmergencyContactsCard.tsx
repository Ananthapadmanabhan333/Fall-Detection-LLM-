import { Users, Phone } from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({ contacts }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-white">Caregiver Escalation Directory</h2>
        </div>
        <span className="text-xs text-slate-400">Order of Contact</span>
      </div>

      <div className="space-y-2.5">
        {contacts.length === 0 ? (
          <p className="text-xs text-slate-400">No registered emergency contacts.</p>
        ) : (
          contacts.map((contact, index) => (
            <div
              key={contact.id || index}
              className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                  {contact.priority_order || index + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{contact.name}</div>
                  <div className="text-[11px] text-slate-400">{contact.relationship_type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-xs flex items-center gap-1 transition"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
