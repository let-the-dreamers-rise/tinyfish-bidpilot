"use client";

import { useState } from "react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

export function RoiCalculator() {
  const [bidsPerMonth, setBidsPerMonth] = useState(8);
  const [hoursPerBid, setHoursPerBid] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(85);
  const [automationCoverage, setAutomationCoverage] = useState(70);

  const recoveredHours =
    bidsPerMonth * hoursPerBid * (automationCoverage / 100);
  const monthlySavings = recoveredHours * hourlyCost;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-xl lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-label">ROI model</p>
          <h3 className="mt-3 text-2xl font-medium text-white">
            Show the labor this agent removes
          </h3>
        </div>
        <span className="signal-face text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
          proposal ops
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="section-label">bids per month</span>
          <input
            type="number"
            min={1}
            max={40}
            value={bidsPerMonth}
            onChange={(event) => setBidsPerMonth(Number(event.target.value) || 1)}
            className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="section-label">hours per bid</span>
          <input
            type="number"
            min={1}
            max={80}
            value={hoursPerBid}
            onChange={(event) => setHoursPerBid(Number(event.target.value) || 1)}
            className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="section-label">loaded hourly cost</span>
          <input
            type="number"
            min={10}
            max={300}
            value={hourlyCost}
            onChange={(event) => setHourlyCost(Number(event.target.value) || 10)}
            className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="section-label">automation coverage %</span>
          <input
            type="number"
            min={10}
            max={95}
            value={automationCoverage}
            onChange={(event) =>
              setAutomationCoverage(Number(event.target.value) || 10)
            }
            className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 border-t border-white/8 pt-6 md:grid-cols-3">
        <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
          <p className="section-label">hours recovered</p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.05em] text-white">
            {number.format(Math.round(recoveredHours))}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/54">per month</p>
        </div>

        <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
          <p className="section-label">monthly savings</p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.05em] text-white">
            {currency.format(monthlySavings)}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/54">
            before platform pricing
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
          <p className="section-label">annualized value</p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.05em] text-white">
            {currency.format(annualSavings)}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/54">
            from one proposal team
          </p>
        </div>
      </div>
    </div>
  );
}
