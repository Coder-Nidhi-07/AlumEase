import React from 'react';
import Sidebar from '../components/Sidebar';
import Container from '../components/Container'; // Assuming Container sets max-width/padding
import '../App.css'; // For glass-effect and standard styling

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="w-full p-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          🔒 Privacy Policy
        </h1>
        
        {/* Main Content Card (Simulating glass effect / clean container) */}
        <div className="glass-effect p-8 rounded-xl shadow-xl border border-[#D48C45]/50 text-[#3A2C18]">
          
          <p className="text-sm italic mb-6">
            Effective Date: January 1, 2025
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information primarily to connect you with your institution and fellow alumni. This includes:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6 space-y-1 text-base">
            <li><span className="font-semibold">Personal Identifiable Information (PII):</span> Name, email address, phone number, and year of passing.</li>
            <li><span className="font-semibold">Academic Information:</span> Degree, department, and CGPA (optional).</li>
            <li><span className="font-semibold">Professional Data:</span> Current company, position, and achievements (optional).</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">2. How We Use Your Data</h2>
          <p className="mb-4">
            Your information is used for:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6 space-y-1 text-base">
            <li>Verifying alumni status and identity.</li>
            <li>Facilitating communication regarding events and announcements.</li>
            <li>Populating the Alumni Directory for professional networking.</li>
            <li>Improving the platform's features and user experience.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">3. Data Sharing and Disclosure</h2>
          <p className="mb-6 text-base">
            We do not sell your personal data. We only share information with the <b>host institution (IKGPTU)</b> for official alumni relations purposes and with third-party service providers (e.g., cloud hosting) necessary to operate the platform, under strict confidentiality agreements.
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">4. Your Rights</h2>
          <p className="text-base">
            You have the right to access and update your profile information at any time via the Profile section. For deletion requests or questions, please contact the institutional administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;