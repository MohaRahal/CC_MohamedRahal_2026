import { useEffect } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const variants = {
  error: { icon: CircleAlert, accent: 'bg-red-500', iconBox: 'bg-red-50 text-red-600', title: 'Não foi possível concluir' },
  success: { icon: CircleCheck, accent: 'bg-fresh-grass', iconBox: 'bg-green-50 text-green-700', title: 'Operação concluída' },
  info: { icon: Info, accent: 'bg-sky-pop', iconBox: 'bg-blue-50 text-blue-600', title: 'Informação' },
};

export default function Toast({ message, type = 'info', onClose, duration = 6000 }) {
  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-sandstone bg-white shadow-2xl" role="status" aria-live="polite">
      <div className={`h-1 w-full ${variant.accent}`} />
      <div className="flex items-start gap-3 p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${variant.iconBox}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-ink-black">{variant.title}</p>
          <p className="mt-1 text-sm leading-5 text-stone-gray">{message}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-1.5 text-stone-gray hover:bg-cream-paper" aria-label="Fechar mensagem">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
