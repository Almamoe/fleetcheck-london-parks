
import React from 'react';

const Header = () => {
  return (
    <header className="bg-emerald-800 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center gap-4">
        <img
          src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
          alt="City of London"
          className="h-12 w-12"
        />
        <div>
          <h1 className="text-xl font-bold">FleetCheck</h1>
          <p className="text-sm text-emerald-100">City of London Parks & Recreation</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
