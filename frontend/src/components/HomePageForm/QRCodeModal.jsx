import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ show, onClose, url, title = "Start Telegram Bot" }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full flex flex-col items-center relative">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4 text-[#75002b]">{title}</h3>
        <QRCodeSVG value={url} size={180} />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-blue-600 underline break-all text-center"
        >
          {url}
        </a>
        <div className="mt-2 text-xs font-semibold text-gray-500 text-center">
          Scan the QR or click the link to start the bot in Telegram before
          requesting OTP and then follow instructions or send your mobile number in chat (Needs to be done only once).
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
