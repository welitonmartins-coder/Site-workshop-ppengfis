import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Wrench, BookOpen, Send } from 'lucide-react'
import { DATES, PROGRAM, SPEAKERS, VENUE, SPONSORS, CONTACTS, COMMITTEE} from './content';
import ProgramSection from "./components/ProgramSection";

// ⚠️ Ajuste as datas para seus prazos reais
const REG_DEADLINE = new Date('2026-10-057T23:59:59-03:00'); // Registration deadline
const ABS_DEADLINE = new Date('2026-09-25T23:59:59-03:00');  // Abstract deadline

const now = new Date();
const isRegClosed = now > REG_DEADLINE;
const isAbsClosed = now > ABS_DEADLINE;


export default function App() {

          const [regError, setRegError] = React.useState("");

          async function handleRegistrationSubmit(e) {
            const form = e.currentTarget;
            const email = (form.email?.value || "").trim().toLowerCase();

            // 1) Bloqueio leve no cliente (mesmo dispositivo)
            if (email && localStorage.getItem(`reg_${email}`)) {
              e.preventDefault();
              setRegError("Este e-mail já realizou uma inscrição neste dispositivo.");
              return;
            }

            // 2) (Opcional) Checagem anti-robô simples por tempo entre cliques
            const last = Number(localStorage.getItem('reg_last_ts') || 0);
            const nowTs = Date.now();
            if (nowTs - last < 5000) { // < 5s desde a última tentativa
              e.preventDefault();
              setRegError("Por favor, aguarde alguns segundos antes de enviar novamente.");
              return;
            }

            // 3) Se quiser integrar a função serverless /check-duplicate depois,
            //    você pode manter este try/catch (ele falha silenciosamente se não existir)
            try {
              const r = await fetch('/.netlify/functions/check-duplicate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ formName: 'registration', email })
              });
              if (r.ok) {
                const { exists } = await r.json();
                if (exists) {
                  e.preventDefault();
                  setRegError("Já existe uma inscrição para este e-mail.");
                  return;
                }
              }
            } catch {
              // sem função no ar → segue o fluxo normal
            }

            // Marca local para evitar reenvio e aplica pequena janela de tempo
            if (email) localStorage.setItem(`reg_${email}`, '1');
            localStorage.setItem('reg_last_ts', String(nowTs));
          }


  return (
    <div className="min-h-screen bg-transparent text-slate-950 transition-colors">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-nav border-b border-slate-200 shadow-sm">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/img/logo-ppengfis.png"
              alt="PPENGFIS Logo"
              className="h-20 w-20 object-contain"
            />
            <span className="font-semibold">VII Workshop – PPENGFIS</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-teal-700 transition">About</a>
            <a href="#dates" className="hover:text-teal-700 transition">Dates</a>
            <a href="#program" className="hover:text-teal-700 transition">Program</a>
            <a href="#speakers" className="hover:text-teal-700 transition">Speakers</a>
            <a href="#venue" className="hover:text-teal-700 transition">Venue</a>
            <a href="#sponsors" className="hover:text-teal-700 transition">Sponsors</a>
            <a href="#registration" className="hover:text-teal-700 transition">Registration</a>
            <a href="#abstract-submission" className="hover:text-teal-700 transition">Abstract Submission</a>
          </div>
          
          <div className="flex items-center gap-2">
            <img
              src="/img/ufrpe-logo.png"
              alt="UFRPE Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <a href="#registration" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-medium shadow-sm hover:bg-teal-700 transition">Register</a>
          
          </div>

        </nav>
      </header>
{/* 
      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full h-48 md:h-[300px] overflow-hidden rounded-2xl shadow-md">
          <img
            src="/img/hero-bg.png"
            alt="Faixa Workshop"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full h-36 sm:h-64 md:h-72 overflow-hidden rounded-2xl border border-white/70 shadow-lg">
          <img
            src="/img/hero-bg.png"
            alt="Faixa Workshop"
            className="w-full h-full object-cover object-center md:object-top"
          />
        </div>
      </div>



      {/* Hero */}
      <section className= "relative bg-cover bg-center bg-no-repeat max-w-6xl mx-auto overflow-hidden" >

          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-start">
            
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >

            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.12] tracking-tight bg-gradient-to-r from-slate-950 via-teal-700 to-blue-700 bg-clip-text text-transparent pb-1">
              VII International Workshop of the Graduate Program in Physics Engineering
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-500">
              UFRPE • Graduate Program in Physics Engineering (PPENGFIS)
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a href="#program" className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium shadow-sm hover:from-teal-700 hover:to-blue-700 transition"> View Program
              </a>
              <a href="#registration"className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium shadow-sm hover:border-teal-300 hover:text-teal-700 transition" > Register now
              </a>
              <a href="#abstract-submission"className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium shadow-sm hover:border-teal-300 hover:text-teal-700 transition" > Abstract Submission
              </a>
            </div>

            </motion.div> 

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >

            <div className="mt-4 md:mt-6 w-full h-72 md:h-[320px] rounded-2xl border border-white/70 shadow-lg overflow-hidden">
              <video
                src="/videos/apresentacao.mp4"
                autoPlay
                muted
                loop  
                playsInline
                className="w-full h-full object-cover"
              />
            </div>


          </motion.div>

          </div>



          <div className= "mt-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm mx-auto max-w-6xl px-4 py-5">
            
            <div className="rounded-xl bg-white/85 border border-slate-200 border-l-4 border-l-teal-500 p-4 shadow-sm">
              <p className="font-semibold text-slate-950">Dates</p>
              <p className="text-slate-600">{DATES.find(d => /workshop/i.test(d.t))?.d || "12–13 Nov 2025"}</p>
            </div>
            
            <div className="rounded-xl bg-white/85 border border-slate-200 border-l-4 border-l-blue-500 p-4 shadow-sm">
              <p className="font-semibold text-slate-950">Location</p>
              <p className="text-slate-600">{VENUE.address || "UFRPE/UACSA – PE"}</p>
            </div>
            
            <div className="rounded-xl bg-white/85 border border-slate-200 border-l-4 border-l-amber-500 p-4 shadow-sm">
              <p className="font-semibold text-slate-950">Format</p>
              <p className="text-slate-600">In-person • Free</p>
            </div>
          </div>

      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About the Workshop</h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              The VII International Workshop of the Graduate Program in Physics Engineering (PPENGFIS/UFRPE)
              brings together researchers, students and industry to discuss advances in material science and 
              engineering, optoelectronics and related fields. The event includes invited talks and poster sessions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-white/90 to-teal-50/90 border border-teal-100 p-5 shadow-sm">
              <p className="text-base font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4 text-teal-600"/>Topics</p>
              <p className="text-sm text-slate-600 mt-2"> Optoelectronics, Materials Science and Engineering.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-white/90 to-amber-50/90 border border-amber-100 p-5 shadow-sm">
              <p className="text-base font-semibold flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-600"/>Target audience</p>
              <p className="text-sm text-slate-600 mt-2">Graduate & undergraduate students, researchers, industry partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important dates */}
      <section id="dates" className="bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Important Dates</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {DATES.map((k, i) => (
              <div key={i} className={[
                "rounded-xl bg-white/85 border p-5 shadow-sm",
                ["border-teal-200 border-t-4 border-t-teal-500", "border-blue-200 border-t-4 border-t-blue-500", "border-amber-200 border-t-4 border-t-amber-500", "border-rose-200 border-t-4 border-t-rose-500"][i % 4],
              ].join(" ")}><p className="font-semibold">{k.t}</p><p className="text-slate-600">{k.d}</p></div>
            ))}
          </div>
        </div>
      </section>

     {/* Program */}
      <ProgramSection data={PROGRAM} />
         



      {/* Speakers */}
      <section id="speakers" className="bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Invited Speakers</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SPEAKERS.map((sp, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
                {sp.photo
                  ? <img src={sp.photo} alt={sp.name} className="aspect-square w-full object-contain border-b border-slate-200 bg-slate-50" />
                  : <div className="aspect-square w-full bg-slate-50" />
                }
                <div className="p-4">
                  <p className="text-base font-semibold">{sp.name}</p>
                  <p className="text-sm text-slate-600">
                    {[sp.affiliation, sp.talk].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
            ))} 
          </div>
        </div>
      </section>

      {/* Venue */}
      <section id="venue" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Venue</h2>
          <p className="text-slate-700 mb-6">{VENUE.address || "UFRPE – Recife, Pernambuco, Brazil."}</p>
          
          <p className="text-slate-700 mb-6">
            There will be a <strong>free university shuttle bus</strong>, departing from
            <strong> UFRPE Main Campus</strong> to <strong>UACSA</strong> and returning at the end of the day. 
            The website will be updated with more details for participants who wish to use the <strong> workshop transportation service</strong>.
          </p>

              {VENUE.map_url ? (
                <div className="aspect-video w-full rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <iframe
                    src={VENUE.map_url}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-slate-200 grid place-items-center bg-white/85">Map placeholder</div>
              )}

              {/* Bus Lines */}
                <h3 className="mt-10 text-xl font-semibold mb-2">If you are not using the event shuttle bus, below are public transportation
                   options to reach the venue.</h3>

                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="font-semibold">From Cabo Terminal (TI Cabo):</p>
                    <ul className="list-disc list-inside">
                      <li>Line 129 – Paiva / TI Cabo</li>
                      <li>Line 157 – Gaibu / TI Cabo</li>
                      <li>Line 178 – Porto de Suape / TI Cabo</li>
                      <li>Line 196 – Nossa Senhora do Ó / TI Cabo (Porto de Galinhas)</li>
                      <li>Line 198 – Ipojuca / TI Cabo</li>
                      <li>Line 199 – Camela / TI Cabo</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">From Santa Rita Terminal, Recife Downtown:</p>
                    <ul className="list-disc list-inside">
                      <li>Line 185 – TI Cabo (Cais de Santa Rita)</li>
                      <li>Line 191 – Recife / Porto de Galinhas (N. Sra. do Ó)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">From Cajueiro Seco Terminal, Jaboatão dos Guararapes:</p>
                    <ul className="list-disc list-inside">
                      <li>Line 139 – TI Cabo / TI Cajueiro Seco</li>
                      <li>Line 181 – Cabo (Cohab) / TI Cajueiro Seco (Faculdades)</li>
                    </ul>
                  </div>
                </div>



      </section>

      {/* Sponsors */}
      <section id="sponsors" className="bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Sponsors & Support</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 items-center">
                  {SPONSORS.length ? SPONSORS.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center h-28 rounded-xl border border-slate-200 p-2 bg-white/90 shadow-sm"
                    >
                      {s.logo ? (
                        <img
                          src={s.logo}
                          alt={s.name || "sponsor"}
                          className="max-h-20 object-contain"
                        />
                      ) : (
                        <span className="text-sm text-slate-500">Logo</span>
                      )}
                    </div>
                  )) : Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center h-28 rounded-xl border border-slate-200 p-2 bg-white/90 text-sm text-slate-500 shadow-sm"
                    >
                      Logo
                    </div>
                  ))}

          </div>
        </div>
      </section>


      {/* Registration (Netlify Forms) */} 
      <section id="registration" className="mx-auto max-w-6xl px-4 py-5">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Lado esquerdo: informações (mantido) */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Registration</h2>

            <p className="text-slate-700 mb-4">
              Participation in the <strong>VII International Workshop of the Graduate Program in Physics Engineering</strong>
              is <strong>free of charge</strong>, but registration is required.
            </p>

            <div className="space-y-3 text-sm">
              {CONTACTS.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {CONTACTS.email}
                </p>
              )}
              {CONTACTS.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {CONTACTS.phone}
                </p>
              )}
            </div>
          </div>

          {/* Lado direito: formulário Netlify */}
          {isRegClosed ? (
            <div className="space-y-4 bg-white/90 border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="p-4 rounded-xl border bg-yellow-50 text-yellow-900">
                Registration is closed (deadline: {REG_DEADLINE.toLocaleString('pt-BR')})
              </div>
              <p className="text-sm text-slate-600">
                If you believe this is a mistake, please contact the organization.
              </p>
            </div>
          ) : (
            <form
              name="registration"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              data-netlify-recaptcha="true"
              action="/thanks_registration.html"
              onSubmit={handleRegistrationSubmit}
              className="space-y-4 bg-gradient-to-br from-white/95 to-teal-50/80 border-teal-100 p-6 rounded-xl border shadow-sm"
            >
              {/* obrigatório p/ Netlify Forms */}
              <input type="hidden" name="form-name" value="registration" />
              
              {/* honeypot anti-bot */}
              <p className="hidden">
                <label>Don’t fill this out: <input name="bot-field" /></label>
              </p>

              {/* Nome + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full name" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" required />
                <input name="email" type="email" placeholder="E-mail" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" required />
              </div>

              {/* Afiliação + País */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="affiliation" placeholder="Affiliation (University/Institution)" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" />
                <input name="country" placeholder="Country" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>

              {/* Categoria (mantido) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  className="rounded-xl border border-slate-200 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Select your category</option>
                  <option>Undergraduate Student</option>
                  <option>Graduate Student</option>
                  <option>Master’s Student</option>
                  <option>PhD Candidate</option>
                  <option>Professor</option>
                  <option>Researcher</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Mensagem */}
              <textarea
                name="message"
                placeholder="Message (optional)"
                className="min-h-32 rounded-xl border border-slate-200 px-3 py-2 w-full focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />

              {/* reCAPTCHA do Netlify (ative em Site → Forms → Settings) */}
              <div data-netlify-recaptcha="true" className="my-3" />

              {/* Erro de duplicidade/antibot */}
              {regError && <p className="text-red-600 text-sm">{regError}</p>}

              {/* Botão */}
              <button
                type="submit"
                disabled={isRegClosed}
                className="rounded-xl px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium flex items-center gap-2 shadow-sm hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
          )}
        </div>
      </section>
             


      {/* /* Abstract Submission */}
      <section id="abstract-submission" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Abstract Submission</h2>
        <p className="text-slate-700 mb-6">
          Participants who wish to present their work must submit an abstract. 
          Use the link below to access the submission form. 
          The organizing committee will review all abstracts and provide feedback 
          or acceptance confirmation by email.
        </p>

        <a
          href="/abstract.html"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium shadow-sm hover:from-teal-700 hover:to-blue-700 transition"
        >
          Submit your Abstract
        </a>

      </section>

      {/* /*  Organizing Committee */}
      <section id="committee" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Organizing Committee</h2>

        {COMMITTEE?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {COMMITTEE.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-5 flex flex-col items-center text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-1 ring-slate-200 shadow-sm mb-4 bg-slate-100">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400 text-xl">
                      {m.name?.[0] ?? "?"}
                    </div>
                  )}
                </div>

                <p className="font-semibold text-slate-950">{m.name}</p>
                {m.role && <p className="text-sm text-slate-700">{m.role}</p>}
                {m.affiliation && <p className="text-xs text-slate-500 mt-1">{m.affiliation}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Committee will be announced soon.</p>
        )}
      </section>
              


      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl bg-white/70 px-4 py-8 text-sm text-slate-600 grid md:grid-cols-2 gap-3">
          <p>© {new Date().getFullYear()} PPENGFIS • UFRPE • VII International Workshop</p>
          <div className="flex gap-4 md:justify-end">
            <a href="#about" className="hover:underline">About</a>
            <a href="#program" className="hover:underline">Program</a>
            <a href="#registration" className="hover:underline">Registration</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
