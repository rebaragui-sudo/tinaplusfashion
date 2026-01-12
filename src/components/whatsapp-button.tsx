"use client";

import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBERS = [
  { label: "Atendimento 1", number: "5511953714884", display: "11 95371-4884" },
  { label: "Atendimento 2", number: "5511915291840", display: "11 91529-1840" },
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5"
          >
            <p className="mb-2 text-sm font-semibold text-gray-800">Fale Conosco no WhatsApp</p>
            {WHATSAPP_NUMBERS.map((contact) => (
              <a
                key={contact.number}
                href={`https://wa.me/${contact.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase text-green-600/70">{contact.label}</span>
                  <span className="font-bold">{contact.display}</span>
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Contatar via WhatsApp"
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} fill="currentColor" />}
      </button>
    </div>
  );
}
