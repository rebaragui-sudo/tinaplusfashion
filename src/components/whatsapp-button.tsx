"use client";

import { MessageCircle, X, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

    const contacts = [
      {
        name: "Atendimento Tina Plus 1",
        url: "https://wa.me/5511953714884",
        icon: <User className="h-5 w-5" />,
      },
      {
        name: "Atendimento Tina Plus 2",
        url: "https://w.app/tinaplus",
        icon: <User className="h-5 w-5" />,
      },
    ];

  const handleOpenLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      // Use postMessage for external URLs in the Orchids environment
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col gap-2"
          >
            {contacts.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: contact.url } }, "*");
                  }
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-xl transition-all hover:bg-gray-50 active:scale-95 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  {contact.icon}
                </div>
                <span>{contact.name}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? "bg-gray-800" : "bg-green-500"
        }`}
        aria-label="Contatar via WhatsApp"
      >
        {isOpen ? (
          <X size={32} />
        ) : (
          <MessageCircle size={32} fill="currentColor" />
        )}
      </button>
    </div>
  );
}
