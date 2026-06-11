import AnimatedPage from './AnimatedPage';

export default function Dashboard() {
  return (
    <AnimatedPage>
      {/* Editorial Content Section */}
      <main className="max-w-[1440px] mx-auto px-12 pt-[180px] pb-[120px]">
        {/* Full-width statement */}
        <section className="mb-[120px]">
          <h1 className="text-[78px] leading-[1.15] font-[300] mb-[40px]">
            Financial &<br />Operations Overview
          </h1>
          <p className="text-[18px] leading-[1.36] max-w-[600px] text-carbon">
            A comprehensive view of your enterprise's core metrics, designed with absolute clarity and structural rigor. Monitor cash flow, pending invoices, and departmental budgets without friction.
          </p>
        </section>

        {/* 3-column work grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Metric Item 1 */}
          <div className="bg-ink-black text-paper-white aspect-square p-[40px] flex flex-col justify-end group hover:bg-carbon transition-all duration-700 ease-out cursor-default">
            <div className="text-[12px] uppercase mb-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500">Total Revenue</div>
            <div className="text-[54px] leading-[1.21] font-[300] transform group-hover:translate-x-2 transition-transform duration-500 ease-out">$2.4M</div>
          </div>
          
          {/* Metric Item 2 */}
          <div className="bg-smoke text-carbon aspect-square p-[40px] flex flex-col justify-end group hover:bg-pewter transition-all duration-700 ease-out cursor-default">
            <div className="text-[12px] uppercase mb-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500">Active Contracts</div>
            <div className="text-[54px] leading-[1.21] font-[300] transform group-hover:translate-x-2 transition-transform duration-500 ease-out">142</div>
          </div>
          
          {/* Metric Item 3 */}
          <div className="bg-carbon text-paper-white aspect-square p-[40px] flex flex-col justify-end group hover:bg-ink-black transition-all duration-700 ease-out cursor-default">
            <div className="text-[12px] uppercase mb-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500">Pending Tasks</div>
            <div className="text-[54px] leading-[1.21] font-[300] transform group-hover:translate-x-2 transition-transform duration-500 ease-out">18</div>
          </div>
        </section>

        <section className="mt-[120px]">
          <h2 className="text-[45px] leading-[1.22] font-[300] mb-[64px]">Recent Activity</h2>
          
          <div className="flex flex-col gap-[28px]">
            {/* Activity Row */}
            <div className="flex border-t border-smoke pt-[28px] hover:border-carbon transition-colors duration-500 ease-out group">
              <div className="w-1/4 text-[12px] text-ash group-hover:text-carbon transition-colors duration-500">10:42 AM</div>
              <div className="w-3/4 text-[18px] leading-[1.36]">Invoice INV-0921 settled by Acme Corp.</div>
            </div>
            
            <div className="flex border-t border-smoke pt-[28px] hover:border-carbon transition-colors duration-500 ease-out group">
              <div className="w-1/4 text-[12px] text-ash group-hover:text-carbon transition-colors duration-500">09:15 AM</div>
              <div className="w-3/4 text-[18px] leading-[1.36]">New user role configuration updated by Admin.</div>
            </div>

            <div className="flex border-t border-smoke pt-[28px] hover:border-carbon transition-colors duration-500 ease-out group">
              <div className="w-1/4 text-[12px] text-ash group-hover:text-carbon transition-colors duration-500">Yesterday</div>
              <div className="w-3/4 text-[18px] leading-[1.36]">Q3 Financial report generated and archived.</div>
            </div>
          </div>
        </section>
      </main>
    </AnimatedPage>
  );
}
