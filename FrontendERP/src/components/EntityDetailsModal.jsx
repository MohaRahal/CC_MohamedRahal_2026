import { useEffect, useId, useRef } from 'react';
import { ArrowRight, Edit2, Info, X } from 'lucide-react';

export default function EntityDetailsModal({ title, subtitle, fields, onClose, onEdit }) {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const hasValue = (value) => value !== null && value !== undefined && value !== '';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-black/40 p-0 backdrop-blur-[5px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[36px] bg-white sm:max-h-[86vh] sm:rounded-[40px]"
      >
        <header className="relative overflow-hidden bg-cream-paper px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
          <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-fresh-grass/70" aria-hidden="true" />
          <div className="absolute right-24 top-7 h-8 w-8 rounded-full bg-sunshine-yellow" aria-hidden="true" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fresh-grass text-ink-black">
                <Info size={24} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-gray">
                  {subtitle || 'Informações do cadastro'}
                </p>
                <h2 id={titleId} className="mt-1.5 truncate text-2xl font-semibold tracking-[-0.04em] text-ink-black sm:text-3xl">
                  {title || 'Item selecionado'}
                </h2>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-stone-gray transition-colors hover:bg-ink-black hover:text-white focus:outline-none focus:ring-4 focus:ring-fresh-grass/40"
              aria-label="Fechar detalhes"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-ink-black">Detalhes do item</h3>
              <p className="mt-0.5 text-sm text-stone-gray">Confira abaixo os dados completos do registro.</p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-cream-paper px-3 py-1.5 text-xs font-semibold text-stone-gray sm:inline-flex">
              {fields.length} {fields.length === 1 ? 'informação' : 'informações'}
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map(({ label, value, fullWidth = false }, index) => (
              <div
                key={`${label}-${index}`}
                className={`group rounded-[22px] border border-hairline-mist/80 bg-white p-4 transition-colors hover:border-fresh-grass ${fullWidth ? 'sm:col-span-2' : ''}`}
              >
                <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-gray">
                  <span className="h-2 w-2 rounded-full bg-fresh-grass" aria-hidden="true" />
                  {label}
                </dt>
                <dd className={`mt-2 break-words text-[15px] leading-6 ${hasValue(value) ? 'font-medium text-ink-black' : 'font-normal italic text-stone-gray'}`}>
                  {hasValue(value) ? value : 'Não informado'}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-sandstone/60 bg-white px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-3 text-sm font-semibold text-stone-gray transition-colors hover:bg-cream-paper hover:text-ink-black"
          >
            Fechar
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="group flex items-center gap-3 rounded-full bg-ink-black py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-fresh-grass hover:text-ink-black"
            >
              <Edit2 size={16} />
              Editar item
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fresh-grass text-ink-black transition-colors group-hover:bg-white">
                <ArrowRight size={16} />
              </span>
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
