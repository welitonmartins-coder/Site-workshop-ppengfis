import { useState, useMemo } from "react";
import { Clock, MapPin, Mic } from "lucide-react";

export default function ProgramSection({ data }) {
  const days = useMemo(() => Object.keys(data || {}), [data]);
  const [active, setActive] = useState(days[0] ?? "");
  const accentClasses = [
    "border-l-teal-500",
    "border-l-blue-500",
    "border-l-amber-500",
    "border-l-rose-500",
  ];

  function getTypeClass(type) {
    if (/break/i.test(type || "")) {
      return "border-amber-200 bg-amber-50 text-amber-800";
    }
    if (/poster/i.test(type || "")) {
      return "border-rose-200 bg-rose-50 text-rose-800";
    }
    if (/opening/i.test(type || "")) {
      return "border-blue-200 bg-blue-50 text-blue-800";
    }
    return "border-teal-100 bg-teal-50 text-teal-800";
  }

  if (!days.length) {
    return (
      <section id="program" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Program</h2>
        <p className="text-slate-600">Program coming soon.</p>
      </section>
    );
  }

  return (
    <section id="program" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Program</h2>
    

      <div className="rounded-2xl border border-slate-200 bg-white/85 overflow-hidden shadow-sm">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Program days"
          className="flex flex-wrap gap-2 border-b border-slate-200 p-3 bg-slate-50/90 backdrop-blur"
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
                  "px-4 py-2 rounded-xl text-sm font-medium transition border",
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white border-teal-600 shadow-sm"
                    : "bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700 border-slate-200",
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
                className={[
                  "grid grid-cols-[90px_1fr] items-start gap-4 rounded-xl border border-l-4 border-slate-200 bg-white/90 p-4 shadow-sm",
                  accentClasses[idx % accentClasses.length],
                ].join(" ")}
              >
                {/* horário */}
                <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {s.time || "TBA"}
                </div>

                {/* conteúdo */}
                <div className="min-w-0">
                  <div className="font-semibold text-slate-950 break-words">
                    {s.item}
                  </div>

                  {/* Título da palestra (se houver) + link para o resumo */}
                  {(s.title || s.abstractUrl) && (
                    <div className="mt-1 text-sm text-slate-700">
                      {s.title && <span className="italic">{s.title}</span>}
                      {s.abstractUrl && (
                        <>
                          {" "}
                          <a
                            href={s.abstractUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-teal-700 hover:text-teal-900"
                          >
                            [Abstract]
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-600">
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
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${getTypeClass(s.type)}`}>
                        {s.type}
                      </span>
                    )}
                  </div>

                  {s.note && (
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
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
