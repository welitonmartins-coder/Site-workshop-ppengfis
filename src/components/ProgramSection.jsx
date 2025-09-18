import { useState, useMemo } from "react";
import { Clock, MapPin, Mic } from "lucide-react";

export default function ProgramSection({ data }) {
  const days = useMemo(() => Object.keys(data || {}), [data]);
  const [active, setActive] = useState(days[0] ?? "");

  if (!days.length) {
    return (
      <section id="program" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Program</h2>
        <p className="text-gray-600">Program coming soon.</p>
      </section>
    );
  }

  return (
    <section id="program" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Program</h2>

      <div className="rounded-2xl border border-gray-300 bg-gray-50 overflow-hidden">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Program days"
          className="flex flex-wrap gap-2 border-b p-3 bg-gray-100 backdrop-blur"
        >
          {days.map((day) => {
            const isActive = active === day;
            return (
              <button
                key={day}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${day}`}
                id={`tab-${day}`}
                onClick={() => setActive(day)}
                className={[
                  "px-4 py-2 rounded-2xl text-sm font-medium transition border",
                  isActive
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-150 text-gray-700 hover:bg-gray-100 border-gray-300",
                ].join(" ")}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Painel ativo */}
        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="p-5"
        >
          <ul className="space-y-3">
            {(data[active] || []).map((s, idx) => (
              <li
                key={idx}
                className="grid grid-cols-[90px_1fr] items-start gap-4 rounded-xl border bg-gray-150 p-4 shadow-sm"
              >
                {/* horário */}
                <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {s.time || "TBA"}
                </div>

                {/* conteúdo */}
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 break-words">
                    {s.item}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-600">
                    {s.speaker && (
                      <span className="inline-flex items-center gap-1">
                        <Mic className="w-4 h-4" />
                        <span className="break-words">{s.speaker}</span>
                      </span>
                    )}
                    {s.room && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="break-words">{s.room}</span>
                      </span>
                    )}
                    {s.type && (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gray-50">
                        {s.type}
                      </span>
                    )}
                  </div>

                  {s.note && (
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                      {s.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
