import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from '@/lib/axios';
import { 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  MessageCircle,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function WhatsAppConnectionCard() {
  const [status, setStatus] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(60);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get('/whatsapp/status');
      const data = res.data?.data || res.data;
      
      // The backend GET /api/whatsapp/status currently returns:
      // { connected: boolean, resolvedGroupJid: string, hasQr: boolean, timestamp: string }
      setStatus(data);

      if (!data.connected && data.hasQr) {
        fetchQr();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp status:', error);
      setLoading(false);
    }
  }, []);

  const fetchQr = async () => {
    try {
      const res = await axios.get('/whatsapp/qr');
      const data = res.data?.data || res.data;
      if (data?.qr) {
        setQrData(data.qr);
        setRefreshCountdown(60);
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp QR:', error);
      toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    fetchStatus();
  };

  // Poll status every 5 seconds if not connected
  useEffect(() => {
    fetchStatus();

    const pollInterval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [fetchStatus]);

  // QR countdown timer
  useEffect(() => {
    if (status?.connected || !qrData) return;

    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchQr();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [status?.connected, qrData]);

  if (loading && !status) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading WhatsApp Status...</p>
      </div>
    );
  }

  const isConnected = status?.connected;
  const connectionState = status?.connectionState || (isConnected ? 'CONNECTED' : 'WAITING_FOR_QR');

  const getStateStyles = (state) => {
    switch (state) {
      case 'CONNECTED': return { bg: 'bg-emerald-50 text-emerald-700', icon: <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> };
      case 'WAITING_FOR_QR': return { bg: 'bg-orange-50 text-orange-700', icon: <Clock className="h-3 w-3" /> };
      case 'LOGGED_OUT': return { bg: 'bg-red-50 text-red-700', icon: <XCircle className="h-3 w-3" /> };
      case 'RECONNECTING': return { bg: 'bg-blue-50 text-blue-700', icon: <RefreshCw className="h-3 w-3 animate-spin" /> };
      case 'CONNECTING': return { bg: 'bg-yellow-50 text-yellow-700', icon: <RefreshCw className="h-3 w-3 animate-spin" /> };
      default: return { bg: 'bg-gray-100 text-gray-500', icon: <XCircle className="h-3 w-3" /> };
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'CONNECTED': return 'Connected';
      case 'WAITING_FOR_QR': return 'Waiting for QR...';
      case 'LOGGED_OUT': return 'Logged Out';
      case 'RECONNECTING': return 'Reconnecting...';
      case 'CONNECTING': return 'Connecting...';
      default: return 'Not Connected';
    }
  };

  const currentStateStyle = getStateStyles(connectionState);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">WhatsApp Notifications</h3>
            <p className="text-[11px] text-gray-400 font-medium">System dispatch channel</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${currentStateStyle.bg}`}>
          {currentStateStyle.icon}
          {getStateLabel(connectionState)}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {isConnected ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Account</span>
                <span className="font-bold text-gray-800">Agricom Notifications</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Target Group JID</span>
                <span className="font-bold text-gray-800 font-mono text-[10px]">
                  {status?.resolvedGroupJid || 'Not resolved'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Connected Since</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  {new Date(status?.timestamp || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-center text-gray-400 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Secure session active
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center">
            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm relative">
                {connectionState === 'LOGGED_OUT' && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                    <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-xs font-bold text-gray-900">Session Logged Out</p>
                    <p className="text-[10px] text-gray-500">Generating new QR...</p>
                  </div>
                )}
                {qrData ? (
                  <QRCodeSVG value={qrData} size={160} />
                ) : (
                  <div className="h-[160px] w-[160px] bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-medium">
                      {connectionState === 'CONNECTING' ? 'Initializing...' : 'QR not available'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 w-full justify-between px-1">
                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Refreshes in {refreshCountdown}s
                </p>
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="text-[10px] font-bold text-[#007aff] hover:text-blue-700 disabled:opacity-50"
                >
                  Refresh Now
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="flex-1 max-w-[200px] space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-900">Scan using WhatsApp</h4>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Link your account to send automated system notifications.
                </p>
              </div>
              
              <ol className="space-y-2 text-[11px] font-semibold text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">1</span>
                  Open WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">2</span>
                  Go to Settings
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">3</span>
                  Tap <span className="font-bold text-gray-800">Linked Devices</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">4</span>
                  Tap <span className="font-bold text-gray-800">Link a Device</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#007aff]/10 text-[#007aff] flex items-center justify-center text-[9px]">5</span>
                  <span className="text-[#007aff] font-bold">Scan this QR</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
