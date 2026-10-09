import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';

export default function NotFound() {
  return (
    <AnimatedPage>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-paper px-6 py-12 text-ink-black">
        <div className="absolute left-[8%] top-[14%] h-28 w-28 rounded-full bg-sunshine-yellow" />
        <div className="absolute bottom-[12%] right-[8%] h-40 w-40 rounded-full bg-grass-green" />

        <section className="relative z-10 w-full max-w-3xl rounded-[50px] bg-white px-8 py-14 text-center md:px-16 md:py-20">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-grass-green">
            <Compass size={28} strokeWidth={1.8} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-stone-gray">
            Erro 404
          </p>
          <h1 className="mx-auto max-w-2xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-7xl">
            Essa página saiu da rota.
          </h1>
          <p className="mx-auto mb-10 mt-7 max-w-lg text-base leading-7 text-stone-gray">
            O endereço pode ter mudado ou não estar mais disponível. Você pode voltar ao painel e continuar de onde parou.
          </p>

          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-3 rounded-full bg-ink-black py-2 pl-2 pr-6 text-sm font-semibold text-white transition-colors hover:bg-grass-green hover:text-ink-black"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-grass-green text-ink-black">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </span>
            Voltar ao dashboard
          </Link>
        </section>
      </main>
    </AnimatedPage>
  );
}
