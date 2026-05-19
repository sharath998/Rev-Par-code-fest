import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F6F2]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#EAE7E0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 bg-[#2C2C2C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-display">R</span>
            </div>
            <span className="font-display font-semibold text-[#2C2C2C]">RevPar Admin</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-[#2C2C2C]">Admin User</div>
              <div className="text-xs text-[#7A7672]">admin@revpar.com</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#CBA135]/20 flex items-center justify-center text-[#CBA135] font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
