import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona y visualiza la información del sistema bancario
            </p>
          </div>
        )}
        <div className="bg-white shadow-sm rounded-lg">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
