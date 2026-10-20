'use client';

import React, { useState, useEffect } from 'react';
import { Download, Mail, Phone, Search, Filter, Trash2 } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMasterclass, setFilterMasterclass] = useState('');
  const [masterclasses, setMasterclasses] = useState([]);

  useEffect(() => {
    // Load leads and masterclasses from localStorage
    const savedLeads = localStorage.getItem('masterclass_registrations');
    const savedMasterclasses = localStorage.getItem('masterclasses');
    
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
    if (savedMasterclasses) {
      setMasterclasses(JSON.parse(savedMasterclasses));
    }
  }, []);

  useEffect(() => {
    // Filter leads based on search and filter
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    if (filterMasterclass) {
      filtered = filtered.filter(lead => lead.masterclassId === filterMasterclass);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filterMasterclass]);

  const handleDeleteLead = (id) => {
    const updated = leads.filter(lead => lead.id !== id);
    setLeads(updated);
    localStorage.setItem('masterclass_registrations', JSON.stringify(updated));
  };

  const handleDownloadCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to download');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Masterclass', 'Registered On'];
    const rows = filteredLeads.map(lead => {
      const masterclass = masterclasses.find(mc => mc.id === lead.masterclassId);
      return [
        lead.name,
        lead.email,
        lead.phone,
        masterclass?.title || 'Unknown',
        new Date(lead.registeredAt).toLocaleDateString('en-IN')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `masterclass-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Masterclass Registrations</h1>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Download CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterMasterclass}
            onChange={(e) => setFilterMasterclass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Masterclasses</option>
            {masterclasses.map(mc => (
              <option key={mc.id} value={mc.id}>{mc.title}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> registrations
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="font-medium">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Masterclass</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registered</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => {
                  const masterclass = masterclasses.find(mc => mc.id === lead.masterclassId);
                  return (
                    <tr key={lead.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">{lead.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                              {lead.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        <div className="font-medium">{masterclass?.title || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">
                          {masterclass?.date} • {masterclass?.time}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(lead.registeredAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-emerald-600">{leads.length}</div>
          <p className="text-sm text-gray-600 mt-2">Total Registrations</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-blue-600">{masterclasses.length}</div>
          <p className="text-sm text-gray-600 mt-2">Active Masterclasses</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-purple-600">
            {masterclasses.reduce((sum, mc) => sum + (leads.filter(l => l.masterclassId === mc.id).length), 0)} / {masterclasses.reduce((sum, mc) => sum + parseInt(mc.capacity || 0), 0)}
          </div>
          <p className="text-sm text-gray-600 mt-2">Capacity Used</p>
        </div>
      </div>
    </div>
  );
}
