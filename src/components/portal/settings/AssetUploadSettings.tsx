import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSignature, 
  Stamp, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { uploadAgencyAsset } from '../../../utils/fileUpload';
import { BrandLogo } from '../../BrandLogo';

export const AssetUploadSettings: React.FC = () => {
  const { agencyConfig, updateAgencyConfig, currentUser } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';

  const [stampUrl, setStampUrl] = useState<string>(agencyConfig.stamp_url || agencyConfig.stampUrl || '');
  const [signatureUrl, setSignatureUrl] = useState<string>(agencyConfig.signature_url || '/signatures/authorized_signatory.png');
  const [logoUrl, setLogoUrl] = useState<string>(agencyConfig.logo_url || '/logo.svg');

  const [isUploading, setIsUploading] = useState<'stamp' | 'signature' | 'logo' | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const stampInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'stamp' | 'signature' | 'logo') => {
    try {
      setIsUploading(type);
      setUploadStatus(`Uploading ${type} asset...`);
      
      const folder = type === 'stamp' ? 'stamps' : (type === 'signature' ? 'signatures' : 'logos');
      const result = await uploadAgencyAsset(file, folder);

      if (result.success && result.url) {
        if (type === 'stamp') {
          setStampUrl(result.url);
          updateAgencyConfig({ stamp_url: result.url, stampUrl: result.url });
        } else if (type === 'signature') {
          setSignatureUrl(result.url);
          updateAgencyConfig({ signature_url: result.url });
        } else if (type === 'logo') {
          setLogoUrl(result.url);
          updateAgencyConfig({ logo_url: result.url });
        }
        setUploadStatus(`${type.toUpperCase()} updated successfully!`);
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setUploadStatus(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Stamp className="w-4 h-4 text-cyan-400" />
            <span>Digital Company Seal & Signatures</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Official company stamp, authorized signatory signature, and brand assets for document PDF stamping.
          </p>
        </div>

        {uploadStatus && (
          <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Official Company Stamp */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company Stamp / Seal</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">PNG / SVG</span>
            </div>

            {/* Stamp Preview Canvas */}
            <div className="h-40 rounded-xl bg-white/95 border border-slate-300 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              {stampUrl ? (
                <img
                  src={stampUrl}
                  alt="Company Stamp"
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-all hover:scale-105"
                />
              ) : (
                <div className="text-center p-4">
                  <Stamp className="w-10 h-10 mx-auto text-slate-400 opacity-40 mb-1" />
                  <span className="text-xs text-slate-500 font-medium block">No official stamp uploaded</span>
                  <span className="text-[10px] text-slate-400">Click upload to attach seal</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Imprinted alongside the authorized signatory block on quotations and tax invoices.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={stampInputRef}
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'stamp');
              }}
            />
            <button
              type="button"
              disabled={isUploading === 'stamp' || !isSuperAdmin}
              onClick={() => stampInputRef.current?.click()}
              className="flex-1 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              {isUploading === 'stamp' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>{isUploading === 'stamp' ? 'Uploading...' : 'Upload New Stamp'}</span>
            </button>

            {stampUrl && isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setStampUrl('');
                  updateAgencyConfig({ stamp_url: '', stampUrl: '' });
                }}
                className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove Stamp"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Authorized Signature */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Authorized Signature</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">PNG / SVG</span>
            </div>

            {/* Signature Preview Canvas */}
            <div className="h-40 rounded-xl bg-white/95 border border-slate-300 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  alt="Authorized Signature"
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-all hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG signature if image not found
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <FileSignature className="w-10 h-10 mx-auto text-slate-400 opacity-40 mb-1" />
                  <span className="text-xs text-slate-500 font-medium block">No signature image uploaded</span>
                  <span className="text-[10px] text-slate-400">Default vector signature is used</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Signatory signature for digital validation on invoices and estimates.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={sigInputRef}
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'signature');
              }}
            />
            <button
              type="button"
              disabled={isUploading === 'signature' || !isSuperAdmin}
              onClick={() => sigInputRef.current?.click()}
              className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              {isUploading === 'signature' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>{isUploading === 'signature' ? 'Uploading...' : 'Upload Signature'}</span>
            </button>

            {signatureUrl && isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setSignatureUrl('');
                  updateAgencyConfig({ signature_url: '' });
                }}
                className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove Signature"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Official Brand Logo Asset */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Brand Logo Asset</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">SVG / PNG</span>
            </div>

            {/* Logo Preview Canvas */}
            <div className="h-40 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden gap-2">
              <BrandLogo size="md" variant="full" theme="dark" />
              <div className="p-2 rounded bg-white/95 border border-slate-300">
                <BrandLogo size="sm" variant="icon" theme="light" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Primary brand emblem for client portals, PDF headers, and public pages.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'logo');
              }}
            />
            <button
              type="button"
              disabled={isUploading === 'logo' || !isSuperAdmin}
              onClick={() => logoInputRef.current?.click()}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              {isUploading === 'logo' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>{isUploading === 'logo' ? 'Uploading...' : 'Upload Brand Logo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
