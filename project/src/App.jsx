import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   SAMPLE DATA
═══════════════════════════════════════════════ */
const SEED = [
  {
    id: "1",
    name: "Nikola Tesla",
    era: "1856 – 1943",
    origin: "Serbia / USA",
    field: "Electrical Engineering",
    tagline: "The man who invented the 20th century, then got erased from it.",
    story: `While Edison's name adorned every lightbulb in America, Tesla quietly built the alternating current system that powers the entire world to this day. He gave humanity wireless transmission, the radio (stolen by Marconi), the rotating magnetic field, and fluorescent lighting — then died penniless in a hotel room in New York. J.P. Morgan cut his funding when he realized Tesla wanted to give electricity away for free. The establishment could not monetize a genius who genuinely wanted to liberate the world. So they buried him.`,
    quote: "The present is theirs. The future, for which I really worked, is mine.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG",
    erased_by: "Edison, J.P. Morgan & Corporate Greed",
    rediscovered: "Partially — still underrated"
  },
  {
    id: "2",
    name: "Rosalind Franklin",
    era: "1920 – 1958",
    origin: "United Kingdom",
    field: "X-ray Crystallography / Biology",
    tagline: "Her photograph discovered DNA. Her name was left off the Nobel Prize.",
    story: `Rosalind Franklin's X-ray diffraction image — Photo 51 — was the single piece of evidence that revealed the double helix structure of DNA. Watson and Crick used it without her knowledge or permission, shown to them by her colleague Maurice Wilkins. They won the Nobel Prize in 1962. Franklin had died of cancer four years earlier, aged 37, likely caused by her own X-ray equipment. The Nobel is not awarded posthumously. History nearly let them take everything.`,
    quote: "Science and everyday life cannot and should not be separated.",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e9/Rosalind_Franklin.jpg",
    erased_by: "Watson, Crick & Institutional Sexism",
    rediscovered: "Slowly — justice still incomplete"
  },
  {
    id: "3",
    name: "Srinivasa Ramanujan",
    era: "1887 – 1920",
    origin: "India",
    field: "Pure Mathematics",
    tagline: "A self-taught genius who saw numbers as living things — and died at 32.",
    story: `Ramanujan had no formal training in mathematics beyond high school. Working alone in Madras on a clerk's salary, he filled notebooks with theorems that mathematicians are still proving correct a century later. He wrote to G.H. Hardy in Cambridge — who immediately recognized a mind unlike any other in human history. Ramanujan claimed his formulas came to him in dreams from a Hindu goddess. Whether divine or neurological, the results were real. He died at 32 from tuberculosis, having barely begun.`,
    quote: "An equation has no meaning unless it expresses a thought of God.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Srinivasa_Ramanujan_-_OPC_-_1.jpg/440px-Srinivasa_Ramanujan_-_OPC_-_1.jpg",
    erased_by: "Colonialism, Poverty & Tuberculosis",
    rediscovered: "Partially — still misunderstood"
  },
  {
    id: "4",
    name: "Ignaz Semmelweis",
    era: "1818 – 1865",
    origin: "Hungary",
    field: "Medicine / Germ Theory",
    tagline: "He figured out how to stop mothers dying in childbirth. Doctors ignored him and he died in an asylum.",
    story: `In 1847, Semmelweis noticed that women giving birth in wards attended by doctors had a death rate five times higher than those attended by midwives. The difference? Doctors came straight from performing autopsies. He mandated handwashing with chlorinated lime solution — and the death rate dropped from 18% to 1%. The medical establishment refused to believe him. The idea that doctors were killing patients was too offensive. He was mocked, dismissed, and eventually committed to a mental asylum, where he died at 47 — possibly beaten by guards. Germ theory was proven correct twenty years later.`,
    quote: "I am no more able to suppress my conviction than I can prevent the beating of my heart.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ignaz_Semmelweis_1860.jpg/440px-Ignaz_Semmelweis_1860.jpg",
    erased_by: "Medical Arrogance & Institutional Pride",
    rediscovered: "Yes — called the 'father of antiseptics'"
  }
];

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --paper:#f2ede4;
  --paper2:#e8e2d8;
  --ink:#0d0c0a;
  --ink2:#1a1916;
  --ink3:#2e2c28;
  --red:#c0392b;
  --red2:#e74c3c;
  --red-dim:rgba(192,57,43,0.12);
  --gold:#b8860b;
  --muted:#7a7060;
  --rim:rgba(13,12,10,0.12);
  --rim2:rgba(13,12,10,0.22);
}
html{scroll-behavior:smooth;}
body{background:var(--paper);color:var(--ink);overflow-x:hidden;cursor:crosshair;}

/* NOISE */
.noise{position:fixed;inset:0;z-index:1;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:0.045; mix-blend-mode:multiply;}

/* SCANLINES */
.scanlines{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.015) 3px,rgba(0,0,0,0.015) 4px);
}

/* ── NAV ── */
.nav{
  position:sticky;top:0;z-index:200;
  background:var(--ink);
  border-bottom:3px solid var(--red);
  padding:0 48px;
  display:flex;align-items:center;justify-content:space-between;
  height:58px;
}
.nav-logo{
  font-family:'Anton',sans-serif;
  font-size:28px;letter-spacing:6px;color:var(--paper);
  position:relative;
}
.nav-logo::after{
  content:'CLASSIFIED';
  position:absolute;top:-2px;right:-76px;
  font-family:'IBM Plex Mono',monospace;
  font-size:8px;color:var(--red);letter-spacing:2px;
  border:1px solid var(--red);padding:2px 5px;
  transform:rotate(-2deg);
}
.nav-center{
  font-family:'IBM Plex Mono',monospace;
  font-size:11px;color:rgba(242,237,228,0.4);
  letter-spacing:3px;text-transform:uppercase;
}
.nav-right{display:flex;gap:10px;}
.nav-btn{
  font-family:'IBM Plex Mono',monospace;font-size:11px;
  padding:7px 16px;border-radius:0;cursor:pointer;
  letter-spacing:2px;text-transform:uppercase;transition:all .15s;
}
.nav-btn-ghost{background:none;border:1px solid rgba(242,237,228,0.25);color:rgba(242,237,228,0.6);}
.nav-btn-ghost:hover{border-color:var(--red);color:var(--red);}
.nav-btn-solid{background:var(--red);border:1px solid var(--red);color:var(--paper);}
.nav-btn-solid:hover{background:var(--red2);}

/* ── HERO ── */
.hero{
  background:var(--ink);
  padding:80px 48px 60px;
  position:relative;overflow:hidden;
  border-bottom:3px solid var(--red);
}
.hero-grid-lines{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(242,237,228,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(242,237,228,0.03) 1px,transparent 1px);
  background-size:60px 60px;
}
.hero-tag{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'IBM Plex Mono',monospace;font-size:11px;
  color:var(--red);letter-spacing:3px;text-transform:uppercase;
  margin-bottom:32px;
}
.hero-tag-dot{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blink 1.2s ease infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
.hero-title{
  font-family:'Anton',sans-serif;
  font-size:clamp(72px,12vw,180px);
  line-height:.88;letter-spacing:4px;
  color:var(--paper);
  margin-bottom:0;
  position:relative;z-index:2;
}
.hero-title-stroke{
  -webkit-text-stroke:2px var(--paper);
  color:transparent;
}
.hero-sub{
  display:flex;align-items:flex-end;justify-content:space-between;
  margin-top:32px;
  border-top:1px solid rgba(242,237,228,0.12);
  padding-top:24px;
}
.hero-desc{
  font-family:'Libre Baskerville',serif;
  font-size:17px;font-style:italic;
  color:rgba(242,237,228,0.6);
  max-width:520px;line-height:1.75;
}
.hero-stats{display:flex;gap:40px;}
.hstat-n{font-family:'Anton',sans-serif;font-size:42px;color:var(--red);line-height:1;}
.hstat-l{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(242,237,228,0.35);letter-spacing:2px;text-transform:uppercase;margin-top:3px;}

/* ── REDACTION BANNER ── */
.redact-banner{
  background:var(--red);
  padding:12px 48px;
  display:flex;align-items:center;gap:20px;
  overflow:hidden;
}
.redact-text{
  font-family:'IBM Plex Mono',monospace;font-size:12px;
  color:var(--paper);letter-spacing:2px;text-transform:uppercase;
  white-space:nowrap;
  animation:marquee 20s linear infinite;
}
@keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* ── SECTION ── */
.section{padding:64px 48px 40px;}
.sec-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  margin-bottom:40px;
  border-bottom:2px solid var(--ink);
  padding-bottom:16px;
}
.sec-title{
  font-family:'Anton',sans-serif;
  font-size:48px;letter-spacing:3px;color:var(--ink);
}
.sec-title span{color:var(--red);}
.sec-meta{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:2px;}

/* ── FILTER BAR ── */
.fbar{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:36px;align-items:center;}
.fbar-label{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-right:8px;}
.fc{
  padding:6px 16px;border:1px solid var(--rim2);background:none;
  font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--muted);
  letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .15s;
}
.fc:hover{border-color:var(--ink);color:var(--ink);}
.fc.on{background:var(--ink);border-color:var(--ink);color:var(--paper);}
.fc-red.on{background:var(--red);border-color:var(--red);color:var(--paper);}

/* ── PERSONALITY GRID ── */
.pgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:2px;
}

/* ── PERSONALITY CARD ── */
.pcard{
  position:relative;background:var(--ink2);
  overflow:hidden;cursor:pointer;
  border:1px solid rgba(242,237,228,0.06);
  transition:transform .25s cubic-bezier(.25,.46,.45,.94);
  group:hover;
}
.pcard:hover{transform:scale(1.015);z-index:10;border-color:var(--red);}
.pcard:hover .pcard-ov{opacity:1;}
.pcard:hover .pcard-body{transform:translateY(0);}
.pcard:hover .pcard-img{transform:scale(1.08)filter:grayscale(30%);}
.pcard-img-wrap{position:relative;aspect-ratio:3/4;overflow:hidden;}
.pcard-img{
  width:100%;height:100%;object-fit:cover;display:block;
  filter:grayscale(80%) contrast(1.1) sepia(0.3);
  transition:transform .5s cubic-bezier(.25,.46,.45,.94), filter .4s;
}
.pcard:hover .pcard-img{transform:scale(1.07);filter:grayscale(40%) contrast(1.1);}
.pcard-ov{
  position:absolute;inset:0;
  background:linear-gradient(to top, rgba(13,12,10,1) 0%, rgba(13,12,10,0.7) 40%, transparent 100%);
  opacity:.7;transition:opacity .3s;
}
.pcard-redact{
  position:absolute;top:18px;left:0;
  background:var(--red);
  font-family:'IBM Plex Mono',monospace;font-size:9px;
  color:var(--paper);letter-spacing:3px;text-transform:uppercase;
  padding:4px 12px 4px 16px;
}
.pcard-field{
  position:absolute;top:18px;right:14px;
  font-family:'IBM Plex Mono',monospace;font-size:9px;
  color:rgba(242,237,228,0.5);letter-spacing:2px;text-transform:uppercase;
  background:rgba(13,12,10,0.7);padding:4px 8px;border:1px solid rgba(242,237,228,0.1);
  backdrop-filter:blur(4px);
}
.pcard-body{
  position:absolute;bottom:0;left:0;right:0;
  padding:22px 20px;
  transform:translateY(4px);
  transition:transform .3s cubic-bezier(.25,.46,.45,.94);
}
.pcard-era{
  font-family:'IBM Plex Mono',monospace;font-size:10px;
  color:var(--red);letter-spacing:2px;margin-bottom:6px;
}
.pcard-name{
  font-family:'Anton',sans-serif;font-size:28px;letter-spacing:1px;
  color:var(--paper);line-height:1.05;margin-bottom:8px;
}
.pcard-tagline{
  font-family:'Libre Baskerville',serif;font-size:12px;font-style:italic;
  color:rgba(242,237,228,0.55);line-height:1.5;
  max-height:0;overflow:hidden;
  transition:max-height .35s ease, opacity .3s;
  opacity:0;
}
.pcard:hover .pcard-tagline{max-height:80px;opacity:1;}
.pcard-cta{
  display:flex;align-items:center;gap:8px;
  margin-top:14px;
  opacity:0;transform:translateY(6px);
  transition:all .3s .05s;
}
.pcard:hover .pcard-cta{opacity:1;transform:translateY(0);}
.pcard-btn{
  flex:1;padding:9px 0;
  background:var(--red);border:none;
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;
  letter-spacing:2px;text-transform:uppercase;color:var(--paper);
  cursor:pointer;transition:background .15s;
}
.pcard-btn:hover{background:var(--red2);}
.pcard-del{
  width:36px;height:36px;
  background:rgba(242,237,228,0.08);border:1px solid rgba(242,237,228,0.15);
  color:rgba(242,237,228,0.5);font-size:14px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .15s;
}
.pcard-del:hover{background:rgba(192,57,43,0.2);border-color:var(--red);color:var(--red);}

/* ── DETAIL MODAL ── */
.modal-bd{
  position:fixed;inset:0;z-index:500;
  background:rgba(13,12,10,0.93);backdrop-filter:blur(16px);
  display:flex;align-items:center;justify-content:center;
  padding:24px;animation:fdIn .2s ease;overflow-y:auto;
}
@keyframes fdIn{from{opacity:0;}to{opacity:1;}}
.modal-box{
  background:var(--paper);
  width:100%;max-width:1000px;
  display:grid;grid-template-columns:340px 1fr;
  animation:mIn .28s cubic-bezier(.34,1.3,.64,1);
  position:relative;
  max-height:90dvh;overflow:hidden;
}
@keyframes mIn{from{transform:scale(.94) translateY(20px);opacity:0;}to{transform:scale(1) translateY(0);opacity:1;}}
.modal-left{position:relative;overflow:hidden;}
.modal-poster{width:100%;height:100%;object-fit:cover;display:block;min-height:500px;filter:grayscale(70%) contrast(1.1) sepia(0.2);}
.modal-poster-ov{position:absolute;inset:0;background:linear-gradient(to right,transparent 50%,var(--paper) 100%);}
.modal-stamp{
  position:absolute;bottom:28px;left:28px;
  border:3px solid var(--red);padding:10px 14px;
  transform:rotate(-4deg);
  font-family:'Anton',sans-serif;font-size:14px;letter-spacing:3px;color:var(--red);
  background:rgba(242,237,228,0.85);
}
.modal-right{padding:48px 44px;overflow-y:auto;max-height:90dvh;}
.modal-close{
  position:absolute;top:20px;right:20px;z-index:10;
  width:38px;height:38px;background:var(--ink);
  border:none;color:var(--paper);font-size:18px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:background .15s;
}
.modal-close:hover{background:var(--red);}
.modal-field{
  font-family:'IBM Plex Mono',monospace;font-size:10px;
  color:var(--red);letter-spacing:3px;text-transform:uppercase;
  margin-bottom:10px;
  display:flex;align-items:center;gap:8px;
}
.modal-field::before{content:'';display:block;width:24px;height:1px;background:var(--red);}
.modal-name{
  font-family:'Anton',sans-serif;
  font-size:clamp(36px,5vw,56px);letter-spacing:2px;color:var(--ink);
  line-height:.95;margin-bottom:8px;
}
.modal-era{
  font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--muted);
  letter-spacing:2px;margin-bottom:24px;
}
.modal-tagline{
  font-family:'Libre Baskerville',serif;font-size:17px;font-style:italic;
  color:var(--ink);line-height:1.65;
  border-left:3px solid var(--red);padding-left:18px;
  margin-bottom:28px;
}
.modal-divider{height:1px;background:var(--rim2);margin:24px 0;}
.modal-story{
  font-family:'Libre Baskerville',serif;font-size:15px;
  color:var(--ink3);line-height:1.85;margin-bottom:28px;
}
.modal-quote-block{
  background:var(--ink);padding:24px 28px;margin-bottom:28px;
  border-left:4px solid var(--red);
  position:relative;
}
.modal-quote-mark{
  font-family:'Anton',sans-serif;font-size:72px;color:var(--red);
  line-height:0;position:absolute;top:28px;left:18px;opacity:0.4;
}
.modal-quote{
  font-family:'Libre Baskerville',serif;font-size:16px;font-style:italic;
  color:var(--paper);line-height:1.7;padding-left:36px;
}
.modal-meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;}
.modal-meta-item{background:var(--paper2);padding:14px 16px;}
.modal-meta-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:5px;}
.modal-meta-val{font-family:'Libre Baskerville',serif;font-size:13px;color:var(--ink);font-weight:700;}
.modal-erased-by{
  background:var(--red-dim);border:1px solid rgba(192,57,43,0.25);
  padding:14px 18px;margin-bottom:20px;
}
.modal-eb-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--red);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;}
.modal-eb-val{font-family:'Libre Baskerville',serif;font-size:13px;color:var(--ink);font-weight:700;}

/* ── ADMIN PANEL ── */
.admin-bd{
  position:fixed;inset:0;z-index:500;
  background:rgba(13,12,10,0.95);backdrop-filter:blur(20px);
  display:flex;align-items:center;justify-content:center;
  padding:24px;animation:fdIn .2s ease;overflow-y:auto;
}
.admin-box{
  background:var(--paper);
  width:100%;max-width:720px;
  padding:0;
  animation:mIn .28s cubic-bezier(.34,1.3,.64,1);
  max-height:90dvh;overflow-y:auto;
}
.admin-head{
  background:var(--ink);padding:24px 36px;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:3px solid var(--red);position:sticky;top:0;z-index:10;
}
.admin-head-title{font-family:'Anton',sans-serif;font-size:22px;letter-spacing:4px;color:var(--paper);}
.admin-head-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--red);letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
.admin-close{background:none;border:1px solid rgba(242,237,228,0.2);color:rgba(242,237,228,0.6);width:36px;height:36px;font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.admin-close:hover{border-color:var(--red);color:var(--red);}
.admin-form{padding:36px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.form-row-full{margin-bottom:16px;}
.form-label{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:7px;}
.form-input,.form-textarea,.form-select{
  width:100%;background:var(--paper2);border:1px solid var(--rim2);
  padding:11px 14px;
  font-family:'Libre Baskerville',serif;font-size:14px;color:var(--ink);
  outline:none;transition:border-color .15s;
  border-radius:0;
  -webkit-appearance:none;
}
.form-input:focus,.form-textarea:focus,.form-select:focus{border-color:var(--red);}
.form-input::placeholder,.form-textarea::placeholder{color:var(--muted);font-style:italic;}
.form-textarea{resize:vertical;min-height:120px;line-height:1.7;}
.form-img-preview{
  width:100%;aspect-ratio:3/4;object-fit:cover;
  filter:grayscale(80%) contrast(1.1);
  margin-top:10px;border:1px solid var(--rim2);
  display:none;
}
.form-img-preview.show{display:block;}
.form-divider{height:1px;background:var(--rim2);margin:24px 0;}
.form-footer{display:flex;gap:12px;justify-content:flex-end;margin-top:28px;}
.form-btn-cancel{padding:12px 24px;background:none;border:1px solid var(--rim2);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .15s;}
.form-btn-cancel:hover{border-color:var(--ink);color:var(--ink);}
.form-btn-submit{padding:12px 32px;background:var(--red);border:none;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--paper);cursor:pointer;transition:background .15s;}
.form-btn-submit:hover{background:var(--red2);}

/* EMPTY */
.empty-state{
  grid-column:1/-1;padding:80px 20px;text-align:center;
}
.empty-icon{font-family:'Anton',sans-serif;font-size:80px;color:var(--rim2);letter-spacing:4px;margin-bottom:16px;}
.empty-txt{font-family:'Libre Baskerville',serif;font-size:18px;font-style:italic;color:var(--muted);}

/* FOOTER */
.footer{
  background:var(--ink);padding:48px;
  border-top:3px solid var(--red);
  margin-top:80px;
}
.footer-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;}
.footer-logo{font-family:'Anton',sans-serif;font-size:48px;letter-spacing:6px;color:var(--paper);}
.footer-logo span{color:var(--red);}
.footer-manifesto{font-family:'Libre Baskerville',serif;font-style:italic;font-size:14px;color:rgba(242,237,228,0.45);max-width:380px;line-height:1.75;}
.footer-bottom{border-top:1px solid rgba(242,237,228,0.1);padding-top:24px;display:flex;align-items:center;justify-content:space-between;}
.footer-copy{font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(242,237,228,0.3);letter-spacing:2px;text-transform:uppercase;}
.footer-count{font-family:'Anton',sans-serif;font-size:22px;color:var(--red);}

/* TOAST */
.toast{
  position:fixed;bottom:32px;right:32px;z-index:999;
  background:var(--ink);border:1px solid var(--red);border-left:4px solid var(--red);
  padding:14px 22px;
  font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--paper);letter-spacing:1px;
  animation:toastIn .3s cubic-bezier(.34,1.3,.64,1);
}
@keyframes toastIn{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}

/* RESPONSIVE */
@media(max-width:900px){
  .nav{padding:0 20px;} .nav-logo::after{display:none;}
  .hero{padding:60px 20px 40px;}
  .hero-stats{gap:24px;}
  .section{padding:48px 20px 32px;}
  .modal-box{grid-template-columns:1fr;}
  .modal-poster{min-height:280px;max-height:320px;}
  .modal-poster-ov{background:linear-gradient(to top,var(--paper) 0%,transparent 60%);}
  .footer{padding:32px 20px;}
  .footer-top{flex-direction:column;gap:24px;}
  .form-row{grid-template-columns:1fr;}
}
`;

/* ═══════════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════════ */
const STORE_KEY = "erased_personalities_v1";
function loadPersonalities() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}
function savePersonalities(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (_) {}
}

/* ═══════════════════════════════════════════════
   FIELD OPTIONS
═══════════════════════════════════════════════ */
const FIELDS = ["All","Physics","Chemistry","Biology","Mathematics","Medicine","Engineering","Astronomy","Other"];
const SORT_OPTS = [{v:"default",l:"Default"},{v:"az",l:"A → Z"},{v:"era",l:"By Era"}];

/* ═══════════════════════════════════════════════
   ADMIN FORM
═══════════════════════════════════════════════ */
function AdminPanel({ onClose, onSave }) {
  const [form, setForm] = useState({
    name:"", era:"", origin:"", field:"Physics",
    tagline:"", story:"", quote:"",
    image:"", erased_by:"", rediscovered:""
  });
  const [imgErr, setImgErr] = useState(false);

  const set = (k, v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.story.trim()) return;
    onSave({ ...form, id: Date.now().toString() });
    onClose();
  };

  return (
    <div className="admin-bd" onClick={onClose}>
      <div className="admin-box" onClick={e => e.stopPropagation()}>
        <div className="admin-head">
          <div>
            <div className="admin-head-title">ADD RECORD</div>
            <div className="admin-head-sub">Restore a forgotten genius</div>
          </div>
          <button className="admin-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-form">
          <div className="form-row">
            <div>
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="e.g. Nikola Tesla" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Era / Years</label>
              <input className="form-input" placeholder="e.g. 1856 – 1943" value={form.era} onChange={e => set("era", e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Country of Origin</label>
              <input className="form-input" placeholder="e.g. Serbia / USA" value={form.origin} onChange={e => set("origin", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Scientific Field</label>
              <select className="form-select" value={form.field} onChange={e => set("field", e.target.value)}>
                {FIELDS.filter(f => f !== "All").map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row-full">
            <label className="form-label">Tagline (one punchy sentence)</label>
            <input className="form-input" placeholder="What makes them unforgettable in one line?" value={form.tagline} onChange={e => set("tagline", e.target.value)} />
          </div>
          <div className="form-row-full">
            <label className="form-label">Their Story *</label>
            <textarea className="form-textarea" style={{minHeight:160}} placeholder="Tell the full story — what they discovered, what was taken from them, why history forgot them..." value={form.story} onChange={e => set("story", e.target.value)} />
          </div>
          <div className="form-row-full">
            <label className="form-label">Famous Quote</label>
            <input className="form-input" placeholder="A quote that captures their spirit..." value={form.quote} onChange={e => set("quote", e.target.value)} />
          </div>
          <div className="form-divider" />
          <div className="form-row">
            <div>
              <label className="form-label">Erased By</label>
              <input className="form-input" placeholder="e.g. Corporate greed, Sexism..." value={form.erased_by} onChange={e => set("erased_by", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Rediscovered?</label>
              <input className="form-input" placeholder="e.g. Partially, Yes, Never..." value={form.rediscovered} onChange={e => set("rediscovered", e.target.value)} />
            </div>
          </div>
          <div className="form-row-full">
            <label className="form-label">Photo URL</label>
            <input className="form-input" placeholder="https://..." value={form.image}
              onChange={e => { set("image", e.target.value); setImgErr(false); }} />
            {form.image && !imgErr && (
              <img src={form.image} className={`form-img-preview show`} alt="preview"
                onError={() => setImgErr(true)} style={{maxHeight:200,objectFit:"cover"}} />
            )}
            {imgErr && <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"var(--red)",marginTop:6}}>Could not load image — check the URL</div>}
          </div>
          <div className="form-footer">
            <button className="form-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="form-btn-submit" onClick={handleSubmit} disabled={!form.name.trim() || !form.story.trim()}>
              ⊕ Add to Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL MODAL
═══════════════════════════════════════════════ */
function DetailModal({ person, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-left">
          {person.image
            ? <img src={person.image} alt={person.name} className="modal-poster" onError={e => { e.target.style.display="none"; }} />
            : <div style={{background:"var(--ink2)",width:"100%",height:"100%",minHeight:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:80,color:"rgba(242,237,228,0.1)",letterSpacing:4}}>?</span>
              </div>
          }
          <div className="modal-poster-ov" />
          <div className="modal-stamp">ERASED<br/>FROM<br/>HISTORY</div>
        </div>
        <div className="modal-right">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-field">{person.field || "Unknown Field"}</div>
          <h2 className="modal-name">{person.name}</h2>
          <div className="modal-era">{person.era}{person.origin ? ` · ${person.origin}` : ""}</div>
          {person.tagline && <p className="modal-tagline">{person.tagline}</p>}
          <div className="modal-divider" />
          <p className="modal-story">{person.story}</p>
          {person.quote && (
            <div className="modal-quote-block">
              <div className="modal-quote-mark">"</div>
              <p className="modal-quote">{person.quote}</p>
            </div>
          )}
          {(person.erased_by || person.rediscovered) && (
            <div className="modal-meta-grid">
              {person.erased_by && (
                <div className="modal-erased-by">
                  <div className="modal-eb-label">Erased By</div>
                  <div className="modal-eb-val">{person.erased_by}</div>
                </div>
              )}
              {person.rediscovered && (
                <div className="modal-meta-item">
                  <div className="modal-meta-label">Rediscovered?</div>
                  <div className="modal-meta-val">{person.rediscovered}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function Toast({ msg }) {
  return <div className="toast">✓ {msg}</div>;
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
export default function App() {
  const [people, setPeople] = useState(() => loadPersonalities() || SEED);
  const [selected, setSelected] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [fieldFilter, setFieldFilter] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Persist
  useEffect(() => { savePersonalities(people); }, [people]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const addPerson = (p) => {
    setPeople(prev => [p, ...prev]);
    showToast(`"${p.name}" added to the archive`);
  };

  const deletePerson = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Remove this record from the archive?")) return;
    setPeople(prev => prev.filter(p => p.id !== id));
    showToast("Record removed");
  };

  let filtered = people.filter(p => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.field?.toLowerCase().includes(q) || p.origin?.toLowerCase().includes(q);
  });
  if (fieldFilter !== "All") filtered = filtered.filter(p => p.field === fieldFilter);
  if (sort === "az") filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));
  if (sort === "era") filtered = [...filtered].sort((a,b) => parseInt(a.era) - parseInt(b.era));

  const tickerContent = [...people, ...people].map((p,i) => (
    <span key={i} className="redact-text">
      &nbsp;&nbsp;&nbsp;█████ {p.name.toUpperCase()} ████ CLASSIFIED ███ {p.field?.toUpperCase()} ████&nbsp;&nbsp;&nbsp;
    </span>
  ));

  return (
    <>
      <style>{CSS}</style>
      <div className="noise" />
      <div className="scanlines" />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">ERASED</div>
        <div className="nav-center">CLASSIFIED ARCHIVE · {people.length} RECORDS</div>
        <div className="nav-right">
          <button className="nav-btn nav-btn-ghost" onClick={() => setSearch(s => s ? "" : "")}>
            ⌕ SEARCH
          </button>
          <button className="nav-btn nav-btn-solid" onClick={() => setAdminOpen(true)}>
            ⊕ ADD RECORD
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-lines" />
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          Declassified Records — Ongoing
        </div>
        <h1 className="hero-title">
          <span className="hero-title-stroke">ER</span>ASED
        </h1>
        <div className="hero-sub">
          <p className="hero-desc">
            A living archive of scientists, inventors and thinkers 
            whom history deliberately forgot. Their discoveries changed the world. 
            Their names did not survive.
          </p>
          <div className="hero-stats">
            <div>
              <div className="hstat-n">{people.length}</div>
              <div className="hstat-l">Records</div>
            </div>
            <div>
              <div className="hstat-n">{[...new Set(people.map(p=>p.field).filter(Boolean))].length}</div>
              <div className="hstat-l">Fields</div>
            </div>
            <div>
              <div className="hstat-n">{[...new Set(people.map(p=>p.origin).filter(Boolean))].length}</div>
              <div className="hstat-l">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* REDACTION BANNER */}
      <div className="redact-banner">
        <div style={{display:"flex",overflow:"hidden",width:"100%"}}>
          {tickerContent}
        </div>
      </div>

      {/* MAIN SECTION */}
      <section className="section">
        <div className="sec-head">
          <h2 className="sec-title"><span>//</span> THE ARCHIVE</h2>
          <div className="sec-meta">{filtered.length} of {people.length} records visible</div>
        </div>

        {/* Search + Filters */}
        <div style={{marginBottom:16}}>
          <input
            className="form-input"
            style={{maxWidth:400,marginBottom:12}}
            placeholder="Search by name, field, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="fbar">
          <span className="fbar-label">Field</span>
          {FIELDS.map(f => (
            <button key={f} className={`fc ${fieldFilter===f?"on fc-red":""}`} onClick={() => setFieldFilter(f)}>{f}</button>
          ))}
          <div style={{width:1,height:20,background:"var(--rim2)",margin:"0 8px"}} />
          <span className="fbar-label">Sort</span>
          {SORT_OPTS.map(o => (
            <button key={o.v} className={`fc ${sort===o.v?"on":""}`} onClick={() => setSort(o.v)}>{o.l}</button>
          ))}
        </div>

        {/* GRID */}
        <div className="pgrid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">?</div>
              <div className="empty-txt">No records match. History got to them first.</div>
            </div>
          ) : filtered.map((p, i) => (
            <div key={p.id} className="pcard" onClick={() => setSelected(p)}>
              <div className="pcard-img-wrap">
                {p.image
                  ? <img src={p.image} alt={p.name} className="pcard-img" onError={e => { e.target.style.display="none"; }} />
                  : <div style={{width:"100%",height:"100%",background:"var(--ink3)",display:"flex",alignItems:"center",justifyContent:"center",aspectRatio:"3/4"}}>
                      <span style={{fontFamily:"'Anton',sans-serif",fontSize:60,color:"rgba(242,237,228,0.08)",letterSpacing:3}}>?</span>
                    </div>
                }
                <div className="pcard-ov" />
                <div className="pcard-redact">Classified</div>
                {p.field && <div className="pcard-field">{p.field}</div>}
              </div>
              <div className="pcard-body">
                {p.era && <div className="pcard-era">{p.era}</div>}
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-tagline">{p.tagline}</div>
                <div className="pcard-cta">
                  <button className="pcard-btn" onClick={() => setSelected(p)}>
                    READ RECORD →
                  </button>
                  <button className="pcard-del" title="Remove" onClick={e => deletePerson(p.id, e)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-logo">ER<span>A</span>SED</div>
          </div>
          <p className="footer-manifesto">
            "The most dangerous thing you can do is erase a person's contribution 
            to human knowledge. We are still paying the price."
            <br /><br />
            This archive exists so they are never forgotten again.
          </p>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} ERASED ARCHIVE · ALL RECORDS DECLASSIFIED</div>
          <div className="footer-count">{people.length} RESTORED</div>
        </div>
      </footer>

      {/* DETAIL MODAL */}
      {selected && <DetailModal person={selected} onClose={() => setSelected(null)} />}

      {/* ADMIN PANEL */}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} onSave={addPerson} />}

      {/* TOAST */}
      {toast && <Toast msg={toast} />}
    </>
  );
}
