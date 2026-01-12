"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = "https://wa.me/5511953714884";
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contatar via WhatsApp"
    >
      <MessageCircle size={32} fill="currentColor" />
    </button>
  );
}
