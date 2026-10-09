import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CircleAlert, CircleCheck, Info, Trash2, X } from 'lucide-react';
import { CONFIRM_EVENT, NOTIFY_EVENT } from './feedback';

const toastVariants = {
  error: { icon: CircleAlert, bar: 'bg-red-500', box: 'bg-red-50 text-red-600', title: 'Não foi possível concluir' },
  success: { icon: CircleCheck, bar: 'bg-fresh-grass', box: 'bg-green-50 text-green-700', title: 'Operação concluída' },
  info: { icon: Info, bar: 'bg-sky-pop', box: 'bg-blue-50 text-blue-600', title: 'Informação' },
};

export default function FeedbackProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++nextId.current;
    setToasts((current) => [...current.slice(-2), { id, message: String(message), type }]);
    window.setTimeout(() => removeToast(id), 6000);
  }, [removeToast]);

  useEffect(() => {
    const handleNotify = (event) => addToast(event.detail.message, event.detail.type);
    const handleConfirm = (event) => setDialog(event.detail);
    const nativeAlert = window.alert;

    // Legacy screens still calling alert() now use the app notification UI.
    window.alert = (message) => addToast(message, /sucesso|sucess/i.test(String(message)) ? 'success' : 'error');
    window.addEventListener(NOTIFY_EVENT, handleNotify);
    window.addEventListener(CONFIRM_EVENT, handleConfirm);

    return () => {
      window.alert = nativeAlert;
      window.removeEventListener(NOTIFY_EVENT, handleNotify);
      window.removeEventListener(CONFIRM_EVENT, handleConfirm);
    };
  }, [addToast]);

  useEffect(() => {
    if (!dialog) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        dialog.resolve(false);
        setDialog(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dialog]);

  const answer = (confirmed) => {
    dialog?.resolve(confirmed);
    setDialog(null);
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {dialog && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink-black/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onMouseDown={() => answer(false)}
          >
            <motion.section
              role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"
              className="relative w-full max-w-md overflow-hidden rounded-[30px] bg-white"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 27 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden bg-cream-paper px-7 pb-6 pt-7">
                <motion.div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-red-100"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.08, type: 'spring' }} />
                <button type="button" onClick={() => answer(false)} className="absolute right-5 top-5 z-10 rounded-full bg-white p-2 text-stone-gray hover:text-ink-black" aria-label="Fechar">
                  <X size={18} />
                </button>
                <motion.div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600"
                  initial={{ rotate: -12, scale: 0.7 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                  <AlertTriangle size={26} />
                </motion.div>
                <h2 id="confirm-title" className="relative mt-5 text-2xl font-medium tracking-tight text-ink-black">{dialog.title || 'Confirmar exclusão'}</h2>
                <p className="relative mt-2 text-sm leading-6 text-stone-gray">{dialog.message}</p>
              </div>
              <div className="flex flex-col-reverse gap-3 px-7 py-5 sm:flex-row sm:justify-end">
                <button type="button" autoFocus onClick={() => answer(false)} className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-stone-gray hover:bg-cream-paper">Cancelar</button>
                <button type="button" onClick={() => answer(true)} className="cursor-pointer flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-red-700">
                  <Trash2 size={16} /> {dialog.confirmLabel || 'Sim, excluir'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-5 right-5 z-[130] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const variant = toastVariants[toast.type] || toastVariants.info;
            const Icon = variant.icon;
            return (
              <motion.div key={toast.id} role="status" aria-live="polite"
                className="pointer-events-auto overflow-hidden rounded-2xl border border-sandstone bg-white shadow-2xl"
                initial={{ opacity: 0, x: 70, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 45, scale: 0.96 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
                <div className={`h-1 ${variant.bar}`} />
                <div className="flex items-start gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${variant.box}`}><Icon size={20} /></div>
                  <div className="min-w-0 flex-1 pt-0.5"><p className="text-sm font-medium text-ink-black">{variant.title}</p><p className="mt-1 text-sm leading-5 text-stone-gray">{toast.message}</p></div>
                  <button type="button" onClick={() => removeToast(toast.id)} className="rounded-full p-1.5 text-stone-gray hover:bg-cream-paper" aria-label="Fechar mensagem"><X size={16} /></button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
