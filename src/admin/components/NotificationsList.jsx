import React from 'react';
import { NotifBadge } from './Badges';

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

const statusOrder = { Clicked: 0, Seen: 1, Sent: 2 };

const NotificationsList = ({ notifications }) => {
  if (!notifications?.length) return null;

  const sorted = [...notifications].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const clicked = notifications.filter(n => n.status === 'Clicked').length;
  const seen    = notifications.filter(n => n.status === 'Seen').length;
  const sent    = notifications.filter(n => n.status === 'Sent').length;

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-[#2C2C2C] mb-1">
        Notified Users
      </h3>
      <p className="text-xs text-[#7A7672] mb-4">
        {notifications.length} users notified ·{' '}
        <span className="text-emerald-600 font-medium">{clicked} clicked</span> ·{' '}
        <span className="text-amber-600 font-medium">{seen} seen</span> ·{' '}
        <span className="text-indigo-600 font-medium">{sent} sent</span>
      </p>

      <div className="overflow-hidden rounded-xl border border-[#EAE7E0]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F6F2] border-b border-[#EAE7E0]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Notified At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE7E0] bg-white">
            {sorted.map(n => (
              <tr key={n.id} className="hover:bg-[#F8F6F2] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CBA135]/15 flex items-center justify-center text-xs font-bold text-[#CBA135] flex-shrink-0">
                      {n.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[#2C2C2C]">{n.userName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#7A7672] hidden sm:table-cell">{n.email}</td>
                <td className="px-4 py-3 text-xs text-[#7A7672] whitespace-nowrap">{fmt(n.notifiedAt)}</td>
                <td className="px-4 py-3"><NotifBadge status={n.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsList;
