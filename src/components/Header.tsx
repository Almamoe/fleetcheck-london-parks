
import React from 'react';
import { Truck } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-slate-800 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <Truck className="text-amber-400" size={32} />
        <div>
          <h1 className="text-xl font-bold">FleetCheck</h1>
          <p className="text-sm text-slate-300">City of London Parks & Recreation</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
