import React from 'react';
import Sidebar from '../components/Sidebar';
import Container from '../components/Container'; // Assuming Container sets max-width/padding
import '../App.css'; // For glass-effect and standard styling

function TermsAndConditions() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="w-full p-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          ⚖️ Terms & Conditions
        </h1>
        
        {/* Main Content Card (Simulating glass effect / clean container) */}
        <div className="glass-effect p-8 rounded-xl shadow-xl border border-[#D48C45]/50 text-[#3A2C18]">
          
          <p className="text-sm italic mb-6">
            Last Updated: January 1, 2025
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">1. Acceptance of Terms</h2>
          <p className="mb-6 text-base">
            By accessing or using the AlumEase platform, you agree to be bound by these <b>Terms and Conditions</b> and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">2. User Obligations</h2>
          <p className="mb-4">
            Users agree to:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6 space-y-1 text-base">
            <li>Provide accurate and current information during registration and profile update.</li>
            <li>Maintain confidentiality of account credentials.</li>
            <li>Use the platform solely for lawful and ethical alumni networking purposes.</li>
            <li>Refrain from posting defamatory, obscene, or illegal content.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">3. Intellectual Property</h2>
          <p className="mb-6 text-base">
            The content, organization, graphics, design, compilation, and other matters related to AlumEase are protected under applicable copyrights and intellectual property rights. Alumni images and data remain the property of the user but are licensed to the **IKGPTU** for alumni engagement use as defined in the Privacy Policy.
          </p>
          
          <h2 className="text-2xl font-bold mb-3 text-[#3A2C18]">4. Termination</h2>
          <p className="mb-6 text-base">
            We reserve the right to terminate or suspend your account immediately, without prior notice or liability, if you breach the Terms and Conditions. This is particularly relevant in cases of platform misuse, harassment, or fraudulent activity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;