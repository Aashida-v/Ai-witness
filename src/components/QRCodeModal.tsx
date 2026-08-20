import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink, Download, User, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  witnessName: string;
  caseTitle: string;
  qrUrl: string;
  onNavigateToPortal?: () => void;
}

export function QRCodeModal({
  open,
  onClose,
  witnessName,
  caseTitle,
  qrUrl,
  onNavigateToPortal,
}: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && qrUrl) {
      QRCode.toDataURL(qrUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [open, qrUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${witnessName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Witness Interview QR Code"
      subtitle="Share this unique QR code with the witness to record their statement"
      size="md"
    >
      <div className="flex flex-col items-center justify-center py-2 text-center">
        {/* Case & Witness Tag */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          <User size={14} />
          <span>{witnessName}</span>
          <span className="text-primary-300">•</span>
          <span className="truncate max-w-[200px]">{caseTitle}</span>
        </div>

        {/* QR Code Container */}
        <div className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-md mb-4 flex flex-col items-center justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Witness QR Code" className="w-56 h-56 rounded-xl" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 animate-pulse">
              <QrCode size={48} />
            </div>
          )}
          <p className="mt-2 text-[11px] font-mono text-slate-400 break-all max-w-[260px]">
            {qrUrl}
          </p>
        </div>

        {/* Info text */}
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Scanning this QR code takes the witness directly to their dedicated <strong>Witness Dashboard</strong> to enter what they saw, answer AI follow-up questions, and update their statement.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
          <Button variant="secondary" onClick={handleCopy} className="w-full text-xs">
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Link
              </>
            )}
          </Button>

          <Button variant="secondary" onClick={handleDownload} disabled={!qrDataUrl} className="w-full text-xs">
            <Download size={14} />
            Save Image
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onNavigateToPortal) {
                onNavigateToPortal();
              } else {
                window.location.href = qrUrl;
              }
            }}
            className="w-full text-xs"
          >
            <ExternalLink size={14} />
            Open Portal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
