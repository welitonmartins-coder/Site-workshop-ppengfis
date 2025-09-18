import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Rocket, Wrench, BookOpen, Send } from 'lucide-react'
import { DATES, PROGRAM, SPEAKERS, VENUE, SPONSORS, CONTACTS, COMMITTEE  } from './content';
import ProgramSection from "./components/ProgramSection";



export default function App() {
  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/img/logo-ppengfis.jpg"
              alt="PPENGFIS Logo"
              className="h-20 w-20 object-contain"
            />
            <span className="font-semibold">VI Workshop – PPENGFIS</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#dates" className="hover:underline">Dates</a>
            <a href="#program" className="hover:underline">Program</a>
            <a href="#speakers" className="hover:underline">Speakers</a>
            <a href="#venue" className="hover:underline">Venue</a>
            <a href="#sponsors" className="hover:underline">Sponsors</a>
            <a href="#registration" className="hover:underline">Registration</a>
            <a href="#abstract-submission" className="hover:underline">Abstract Submission</a>
          </div>
          <div className="flex items-center gap-2">
            <a href="#registration" className="px-4 py-2 rounded-2xl bg-gray-900 text-white hover:opacity-90">Register</a>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full h-48 md:h-[300px] overflow-hidden rounded-2xl shadow-md">
          <img
            src="/img/hero-bg.png"
            alt="Faixa Workshop"
            className="w-full h-full object-cover object-top"
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

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              VI International Workshop of the Graduate Program on Physics Engineering
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600">
              UFRPE • Graduate Program on Physics Engineering (PPENGFIS)
            </p>
            
            <div className="flex gap-3">
              <a href="#program" className="px-5 py-3 rounded-2xl bg-gray-900 text-white hover:opacity-80"> View Program
              </a>
              <a href="#registration"className="px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200" > Register now
              </a>
              <a href="#abstract-submission"className="px-5 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200" > Abstract Submission
              </a>
            </div>

            </motion.div> 

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >

            <div className="mt-4 md:mt-6 w-full h-70 md:h-[320px] rounded-3xl border shadow-sm overflow-hidden">
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
            
            <div className="rounded-2xl bg-gray-100 border  border-gray-300 p-4">
              <p className="font-semibold text-gray-900">Dates</p>
              <p className="text-gray-600">{DATES.find(d => /workshop/i.test(d.t))?.d || "12–13 Nov 2025"}</p>
            </div>
            
            <div className="rounded-2xl bg-gray-100 border  border-gray-300 p-4">
              <p className="font-semibold text-gray-900">Location</p>
              <p className="text-gray-600">{VENUE.address || "UFRPE/UACSA – PE"}</p>
            </div>
            
            <div className="rounded-2xl bg-gray-100 border  border-gray-300 p-4">
              <p className="font-semibold text-gray-900">Format</p>
              <p className="text-gray-600">In-person • Free</p>
            </div>
          </div>

      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About the Workshop</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              The VI International Workshop of the Graduate Program on Physics Engineering (PPENGFIS/UFRPE) 
              brings together researchers, students and industry to discuss advances in material science and 
              engineering, optoelectronics and related fields. The event includes invited talks and poster sessions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-100 border border-gray-300 p-5">
              <p className="text-base font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4"/>Tracks</p>
              <p className="text-sm text-gray-600 mt-2"> Optoelectronics, Materials Science and Engineering.</p>
            </div>
            <div className="rounded-2xl bg-gray-100 border border-gray-300 p-5">
              <p className="text-base font-semibold flex items-center gap-2"><Wrench className="w-4 h-4"/>Who should attend</p>
              <p className="text-sm text-gray-600 mt-2">Graduate & undergraduate students, researchers, industry partners.</p>
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
              <div key={i} className="rounded-2xl bg-gray-100 border border-gray-300 p-5"><p className="font-semibold">{k.t}</p><p className="text-gray-600">{k.d}</p></div>
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
              <div key={i} className="rounded-2xl overflow-hidden border">
                {sp.photo
                  ? <img src={sp.photo} alt={sp.name} className="aspect-square w-full object-contain border border-gray-300 bg-gray-150" />
                  : <div className="aspect-square w-full bg-gray-150" />
                }
                <div className="p-4 border border-gray-300">
                  <p className="text-base font-semibold">{sp.name}</p>
                  <p className="text-sm text-gray-600">
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
          <p className="text-gray-700 mb-6">{VENUE.address || "UFRPE – Recife, Pernambuco, Brazil."}</p>
              {VENUE.map_url ? (
                <div className="aspect-video w-full rounded-2xl border overflow-hidden">
                  <iframe
                    src={VENUE.map_url}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl border grid place-items-center">Map placeholder</div>
              )}
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Sponsors & Support</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 items-center">
                  {SPONSORS.length ? SPONSORS.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center h-28 rounded-xl border p-2 bg-white"
                    >
                      {s.logo ? (
                        <img
                          src={s.logo}
                          alt={s.name || "sponsor"}
                          className="max-h-20 object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">Logo</span>
                      )}
                    </div>
                  )) : Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center h-28 rounded-xl border p-2 bg-white text-sm text-gray-500"
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
          
          {/* Lado esquerdo: informações */}
        <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Registration</h2>

            <p className="text-gray-700 mb-4">
              Participation in the <strong>VI International Workshop of the Graduate Program on Physics Engineering</strong>
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
          <form
            name="registration"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            action="/thanks.html"
            className="space-y-4 bg-gray-150 border-gray-300 p-6 rounded-2xl border"
          >
            {/* obrigatório p/ Netlify Forms */}
            <input type="hidden" name="form-name" value="registration" />
            
            {/* honeypot anti-bot */}
            <p className="hidden">
              <label>Don’t fill this out: <input name="bot-field" /></label>
            </p>

            {/* Nome + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" placeholder="Full name" className="rounded-2xl border px-3 py-2" required />
              <input name="email" type="email" placeholder="E-mail" className="rounded-2xl border px-3 py-2" required />
            </div>

            {/* Afiliação + País */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="affiliation" placeholder="Affiliation (University/Institution)" className="rounded-2xl border px-3 py-2" />
              <input name="country" placeholder="Country" className="rounded-2xl border px-3 py-2" />
            </div>


            {/* Categoria (novo) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                className="rounded-2xl border px-3 py-2"
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
              className="min-h-32 rounded-2xl border px-3 py-2 w-full"
            />

            {/* Botão */}
            <button type="submit" className="rounded-2xl px-4 py-2 bg-gray-900 text-white flex items-center gap-2">
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </section>



      {/* /* Abstract Submission */}
      <section id="abstract-submission" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Abstract Submission</h2>
        <p className="text-gray-700 mb-6">
          Participants who wish to present their work must submit an abstract. 
          Use the link below to access the submission form. 
          The organizing committee will review all abstracts and provide feedback 
          or acceptance confirmation by email.
        </p>

        <a
          href="/abstract.html"
          className="inline-block px-6 py-3 rounded-2xl bg-gray-900 text-white font-medium hover:opacity-90"
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
              <div key={i} className="rounded-2xl border border-gray-300 bg-transparent backdrop-blur p-5 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm mb-4 bg-gray-100">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-400 text-xl">
                      {m.name?.[0] ?? "?"}
                    </div>
                  )}
                </div>

                <p className="font-semibold text-gray-900">{m.name}</p>
                {m.role && <p className="text-sm text-gray-700">{m.role}</p>}
                {m.affiliation && <p className="text-xs text-gray-500 mt-1">{m.affiliation}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Committee will be announced soon.</p>
        )}
      </section>
              


      {/* Footer */}
      <footer className="border-t-300">
        <div className="mx-auto max-w-6xl bg-gray-100 px-4 py-8 text-sm text-gray-600 grid md:grid-cols-2 gap-3">
          <p>© {new Date().getFullYear()} PPENGFIS • UFRPE • VI International Workshop</p>
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
