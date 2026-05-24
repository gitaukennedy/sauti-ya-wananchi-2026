import React, { useState } from 'react';
import Head from 'next/head';

export default function SautiYaWananchi() {
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: 'Hello! Welcome to Sauti ya Wananchi 2026. Ask any question regarding the Finance Bill.' }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English'); 
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const response = await fetch('https://sauti-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery, language })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error contacting server. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SAUTI YA WANANCHI 2026</title>
      </Head>

      {/* Main Container - Uses flex layout to cleanly lock elements inside the screen bounds */}
      <div className="h-screen w-screen bg-[#F4F6F9] text-gray-900 font-sans overflow-hidden flex flex-col" style={{ backgroundColor: '#F4F6F9', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        
        {/* 🧭 Header Layer */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-none">
          {/* 🇰🇪 Clean Patriotic Kenyan Flag Ribbon Accent */}
          <div className="h-1.5 w-full flex" style={{ display: 'flex', height: '6px' }}>
            <div className="flex-1 bg-black" style={{ flex: 1, backgroundColor: 'black' }} />
            <div className="w-1 bg-white" style={{ width: '4px', backgroundColor: 'white' }} />
            <div className="flex-1 bg-[#991B1B]" style={{ flex: 1, backgroundColor: '#991B1B' }} />
            <div className="w-1 bg-white" style={{ width: '4px', backgroundColor: 'white' }} />
            <div className="flex-1 bg-[#065F46]" style={{ flex: 1, backgroundColor: '#065F46' }} />
          </div>

          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 m-0" style={{ fontWeight: '900', color: '#111827', margin: 0 }}>
                SAUTI YA WANANCHI <span className="text-[#991B1B]" style={{ color: '#991B1B' }}>2026</span>
              </h1>
              <p className="text-xs text-gray-500 font-bold m-0 tracking-wide">CITIZEN POWERED FINANCE BILL INSIGHTS</p>
            </div>
            
            {/* View Switching Navigation Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200" style={{ display: 'flex', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('chat')}
                className="px-5 py-2 rounded-lg text-xs font-extrabold transition-all"
                style={{ backgroundColor: activeTab === 'chat' ? '#065F46' : 'transparent', color: activeTab === 'chat' ? 'white' : '#4B5563', borderRadius: '0.5rem', border: 'none', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: '800' }}
              >
                Sauti Chat Portal
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className="px-5 py-2 rounded-lg text-xs font-extrabold transition-all"
                style={{ backgroundColor: activeTab === 'insights' ? '#065F46' : 'transparent', color: activeTab === 'insights' ? 'white' : '#4B5563', borderRadius: '0.5rem', border: 'none', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: '800' }}
              >
                Bill Insights Analysis
              </button>
            </div>

            {/* Language Selector Dropdown (English Baseline Default) */}
            <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="text-xs font-bold text-gray-500">Language:</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-gray-300 text-xs text-gray-900 rounded-lg px-2.5 py-1.5 font-bold cursor-pointer"
                style={{ backgroundColor: 'white', border: '1px solid #D1D5DB', padding: '0.375rem 0.625rem', borderRadius: '0.5rem', fontWeight: '700' }}
              >
                <option>English</option>
                <option>Kiswahili</option>
                <option>Gĩkũyũ</option>
                <option>Dholuo</option>
                <option>Kikamba</option>
              </select>
            </div>
          </div>
        </header>

        {/* 💻 Constrained Work Area - Dynamically Calculates Height */}
        <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col min-h-0" style={{ maxWidth: '56rem', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '1.5rem' }}>
          {activeTab === 'chat' ? (
            /* 💬 Main Chat Portal UI */
            <div className="bg-white border border-gray-200 rounded-2xl flex flex-col flex-1 min-h-0 shadow-lg overflow-hidden relative" style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              
              {/* Elegant Transparent Shield Background Watermark */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center z-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/Coat_of_arms_of_Kenya_%28Armorial_Bearings%29.svg" alt="Kenya Coat of Arms Watermark" className="w-[340px] h-[340px]" />
              </div>

              {/* Status Context Sub-Header Bar */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center relative z-10" style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 1.5rem' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">EXPOSING 2026 PROVISIONS • UNBIASED PUBLIC RESOURCE</span>
                <span className="bg-green-50 text-green-700 text-[10px] px-2.5 py-0.5 rounded-full font-black border border-green-200">
                  LIVE ENGINE ACTIVE
                </span>
              </div>

              {/* Chat Stream Window Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 relative z-10" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
                    <div 
                      className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm font-semibold`}
                      style={{ 
                        maxWidth: '75%', 
                        borderRadius: '1rem', 
                        padding: '0.875rem 1.25rem', 
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        backgroundColor: msg.role === 'user' ? '#991B1B' : 'white', 
                        color: msg.role === 'user' ? 'white' : '#111827',
                        border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB',
                        borderTopRightRadius: msg.role === 'user' ? '0' : '1rem',
                        borderTopLeftRadius: msg.role === 'user' ? '0' : '1rem'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Embedded Loading Animation Block */}
                {loading && (
                  <div className="flex justify-start" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div className="bg-white text-gray-600 rounded-2xl rounded-tl-none px-5 py-3 flex items-center space-x-3 border border-gray-200 text-xs font-bold" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '1rem', borderTopLeftRadius: '0', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="flex space-x-1" style={{ display: 'flex', gap: '0.25rem' }}>
                        <div className="w-2 h-2 bg-[#991B1B] rounded-full animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#991B1B', borderRadius: '50%' }} />
                        <div className="w-2 h-2 bg-[#065F46] rounded-full animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#065F46', borderRadius: '50%' }} />
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: 'black', borderRadius: '50%' }} />
                      </div>
                      <span>Analyzing clause structural updates...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 📥 FIXED: Beautiful, High-Visibility Broad-Width Action Tray Section */}
              <div className="p-4 border-t border-gray-200 bg-white flex space-x-3 items-center relative z-10" style={{ padding: '1.25rem', borderTop: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about digital tax brackets, eTIMS mandates, mobile finance levies..."
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-5 py-4 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-[#065F46] transition-all"
                  style={{ flex: 1, backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '0.75rem', padding: '1rem 1.25rem', fontSize: '0.95rem', color: '#111827' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="bg-[#065F46] hover:bg-[#044a30] text-white font-black px-12 py-4 rounded-xl text-sm tracking-widest transition-all shadow-md uppercase"
                  style={{ backgroundColor: '#065F46', color: 'white', fontWeight: '900', padding: '1rem 3rem', borderRadius: '0.75rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
                >
                  SEND
                </button>
              </div>
            </div>
          ) : (
            /* 📊 Bill Analysis Insights Dashboard View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', overflowY: 'auto' }}>
              <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-md space-y-4" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 tracking-wide" style={{ margin: '0 0 1rem 0', borderBottom: '1px solid #F3F4F6', fontSize: '1.125rem', fontWeight: '900' }}>
                  Key Draft Proposals (2026 Fiscal Framework)
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  The current provisions target revenue expansion objectives across broad-base digital consumption channels and administrative automation gates.
                </p>
                <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem' }}>
                    <h4 className="text-sm font-bold text-gray-900 m-0" style={{ fontWeight: '700' }}>📱 Smart Device Tariff Integration</h4>
                    <p className="text-xs text-gray-600 mt-1 m-0 leading-relaxed">Excise thresholds targeting localized electronics assemblies trend toward 25% levels, altering access baselines for remote operators.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1rem' }}>
                    <h4 className="text-sm font-bold text-gray-900 m-0" style={{ fontWeight: '700' }}>💳 Interchange Settlement Controls</h4>
                    <p className="text-xs text-gray-600 mt-1 m-0 leading-relaxed">Structural re-definitions drag online transaction processing clear within standardized localized withholding tax parameters.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md flex flex-col justify-between" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#991B1B] tracking-widest uppercase" style={{ margin: 0, color: '#991B1B', letterSpacing: '0.1em', fontWeight: '900' }}>Social Impact Vector</h3>
                  <p className="text-xs text-gray-600 leading-relaxed" style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
                    Independent economic assessments flag core risks that applying standard 16% VAT streams directly onto digital transaction exchange platforms could trigger financial exclusion metrics for rural vendors.
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl mt-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '0.75rem', padding: '1rem' }}>
                  <span className="text-[10px] font-black text-[#991B1B] block mb-1 uppercase tracking-wider">eTIMS Compliance Integration</span>
                  <p className="text-[11px] text-gray-600 m-0 leading-relaxed">System-wide auditing rules compel micro-business outlays to synchronize transactions natively to survive regulatory assessments.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 📋 Footer Layer */}
        <footer className="text-center py-3 bg-white border-t border-gray-200 text-[10px] font-bold text-gray-400 tracking-wider flex-none">
          SAUTI YA WANANCHI COALITION • SHIELDING PUBLIC TRANSPARENCY IN 2026
        </footer>
      </div>
    </>
  );
}