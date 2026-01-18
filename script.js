/* =========================================================
   DIKTATORSPIEL – Full Working Script
   Intro: Satz-für-Satz + Mascot Animation
   ========================================================= */

/* ---------- Config ---------- */

// Karten-ID -> Bilddatei (im Ordner /Bilder)
// Tipp: Benenne sauber: exakt Dateinamen inkl. Endung
const CARD_IMAGES = {
  
  2:"./Bilder/Polizei.png",
  3:"./Bilder/Gebühren.png",
  4:"./Bilder/Spätzle.png",
  5:"./Bilder/Nahverkehr.png",
  6: "./Bilder/Maultaschen.png",
  7:"./Bilder/Schwarzwald.png",
  8:"./Bilder/Brezel.png",
  9:"./Bilder/Flughafen.png",
  10:"./Bilder/Bodensee.png",
  11:"./Bilder/Erbe.png",
  12:"./Bilder/Bahnhof.png",
  13:"./Bilder/Trachten.png",
  14:"./Bilder/Dialektpflicht.png",
  15:"./Bilder/Freibadverbot.png",
  16:"./Bilder/Schwabentaler.png",
  17:"./Bilder/Windrad.png",
  19:"./Bilder/Bargeld.png",
  20:"./Bilder/Alkohol.png",
  24:"./Bilder/Religion.png",
  25:"./Bilder/Viertage.png"
  
};

// Für jede Karten-ID: Bild für links/rechts
// Pfade anpassen: ich nehme an: ./Bilder/<DATEI>.png
const DECISION_IMAGES = {
  2:  { left: "./Artikel/PolizeiJa.png",  right: "./Artikel/PolizeiNein.png"  },
  3:  { left: "./Artikel/GebührenJa.png",  right: "./Artikel/GebührenNein.png"  },
  4:  { left: "./Artikel/SpatzleJa.png",  right: "./Artikel/SpatzleNein.png"  },
  5:  { left: "./Artikel/NahverkehrJa.png",  right: "./Artikel/NahverkehrNein.png"  },
  6:  { left: "./Artikel/MaultaschenVerbot.png",  right: "./Artikel/MaultaschenErlaubt.png"  },
  7:  { left: "./Artikel/AbholzenJa.png",  right: "./Artikel/AbholzenNein.png"  },
  8: { left: "./Aritkel/BrezelJa.png", right: "./Artikel/BrezelNein.png" },
  9:  { left: "./Artikel/FlughafenJa.png",  right: "./Artikel/FlughafenNein.png"  },
  10:  { left: "./Artikel/BodenseePrivatJa.png",  right: "./Artikel/BodenseePrivatNein.png"  },
  11:  { left: "./Artikel/UhrJa.png",  right: "./Artikel/UhrNein.png"  }, 
  12:  { left: "./Artikel/BahnhofJa.png",  right: "./Artikel/BahnhofNein.png"  },
  13:  { left: "./Artikel/TrachtenJa.png",  right: "./Artikel/TrachtenNein.png"  },
  14:  { left: "./Artikel/DialektJa.png",  right: "./Artikel/DialektNein.png"  }, 
  15:  { left: "./Artikel/FreibadNein.png",  right: "./Artikel/FreibadJa.png"  },
  16:  { left: "./Artikel/SchwabentalerJa.png",  right: "./Artikel/SchwabentalerNein.png"  },
  17:  { left: "./Artikel/WindradJa.png",  right: "./Artikel/WindradNein.png"  }, 
  19:  { left: "./Artikel/BargeldNein.png",  right: "./Artikel/BargeldJa.png"  },
  20:  { left: "./Artikel/AlkoholVerbotJa.png",  right: "./Artikel/AlkoholVerbotNein.png"  },
  21:  { left: "./Artikel/UhrJa.png",  right: "./Artikel/UhrNein.png"  }, 
  24:  { left: "./Artikel/ReligionVerbotJa.png",  right: "./Artikel/ReligionVerbotNein.png"  },
  25:  { left: "./Artikel/VierTageJa.png",  right: "./Artikel/VierTageNein.png"  },
   
};




const CATEGORIES = ["Bildung", "Sicherheit", "Zufriedenheit", "Finanzen"];

const SCORE_MIN = 0;
const SCORE_MAX = 10;
const START_SCORE = 5;

/* ---------- Intro Dialog / Mascot ---------- */
const INTRO_SENTENCES = [
  "Hallo, mein/e Führer/in!",
  "Heute schlüpfst du in die Rolle eines waschechten Diktators!",
  "Deine Aufgabe wird es sein, das Land nach deinen Vorstellungen zu formen und zu regieren.",
  "Doch pass auf: Deine Entscheidungen bringen Konsequenzen mit sich.",
  "Achte daher darauf, die Dinge immer im Gleichgewicht zu halten.",
  "Viel Erfolg und ein gutes Gelingen!"
];

// Wie viele Bildwechsel (Mund zu/auf) pro Satz
const INTRO_IMAGES_PER_LINE = 6;

// Tempo der Bildwechsel (ms)
const INTRO_FRAME_INTERVAL_MS = 140;

// Mascot Frames
const MASCOT_FRAMES = {
  idle: "./icons/MundZuAugenAuf.png",
  talk: "./icons/MundAufAugenAuf.png",
  blink: "./icons/MundAufAugenZu.png"
};

/* ---------- Event-System ---------- */
const EVENT_TIMER_SECONDS = 10;
const EVENT_CHANCE_PER_TURN = 0.05;

const MUSIC_MUTE_KEY = "diktatorspiel-music-muted";
let musicMuted = false;


function loadMusicMute() {
  const saved = localStorage.getItem(MUSIC_MUTE_KEY);
  musicMuted = saved === "1";
}

function setMusicMuted(on) {
  musicMuted = !!on;
  localStorage.setItem(MUSIC_MUTE_KEY, musicMuted ? "1" : "0");
  applyVolumeToAllSounds();
  updateMusicToggleBtn();
}

function updateMusicToggleBtn() {
  const btn = document.getElementById("music-toggle");
  if (!btn) return;
  btn.textContent = musicMuted ? "Musik: AUS" : "Musik: AN";
}



/* ---------- Volume ---------- */
const VOLUME_KEY = "diktatorspiel-volume";
let masterVolume = 1.0;

/* =========================================================
   DOM helpers (MUSS VOR renderBoard existieren)
   ========================================================= */
const $ = (sel, el = document) => el.querySelector(sel);

const create = (tag, cls) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};



/* =========================================================
   DATA: Deck / Rescue / Events / Messages
   ========================================================= */


const DECK = [
  
  {
    id: 2,
    prompt: "Polizei fordert doppelt so viel Geld, um Bevölkerung besser zu kontrolieren.",
    meta: "Sicherheit",
    left: {
      label: "Finanzieren",
      consequence: "Land ist sicherer, aber niemand traut sich mehr aus dem Haus.",
      effects: { Sicherheit: +2, Zufriedenheit: -2, Finanzen: -1 }
    },
    right: {
      label: "Nicht Finanzieren",
      consequence: "Menschen trauen sich weiterhin raus, Verbrechensrate bleibt hoch.",
      effects: { Sicherheit: -1, Zufriedenheit: +2 }
    }
  },
  {
    id: 3,
    prompt: "Studiengebühren sollen erhöht werden.",
    meta: "Finanzen",
    left: {
      label: "Zustimmen",
      consequence: "Leute wollen nicht mehr studieren gehen.",
      effects: { Finanzen: +1, Bildung: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Mehr Leute gehen studieren.",
      effects: { Finanzen: -1, Bildung: +1 }
    }
  },
  //
  
  //{
   // id: 4,
    //prompt: "Subventionen ( Finanzielle unterstützung) für Spätzle Produzenten.",
    //meta: "Zufriedenheit",
    //left: {
     // label: "Unterstützen",
      //consequence: "Der Spätzlemarkt Boomt wie noch nie zuvor.",
     // effects: { Finanzen: -1, Zufriedenheit: +1 }
   // },
   // right: {
      //label: "Nicht Unterstützen",
     // consequence: "Spätzle Produzenten gehen pleite.",
    //  effects: { Finanzen: +1, Zufriedenheit: -2}
    //}

    //
  //},
  {
    id: 5,
    prompt: "Schüler fordern kostenlosen Nahverkehr zur Schule.",
    meta: "Bildung",
    left: {
      label: "Finanzieren",
      consequence: "Budget sinkt, mehr Schüler in der Schule; einer heilt später Krebs.",
      effects: { Bildung: +2, Zufriedenheit: +1, Finanzen: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Weniger Schüler in der Schule. Kriminalitätsrate steigt.",
      effects: { Bildung: -2, Zufriedenheit: -2, Finanzen: +1 }
    }
  },
  {
    id: 6,
    prompt: "Maultaschen sollen verboten werden, um Fleischverbrauch zu reduzieren.",
    meta: "Zufriedenheit",
    left: {
      label: "Zulassen",
      consequence: "Bevölkerung ist empört. Illegale Maultaschenringe entstehen.",
      effects: { Sicherheit: -2, Zufriedenheit: -1, Finanzen: +1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Maultaschen Industrie boomt. Veganer sind empört.",
      effects: { Finanzen: +2, Zufriedenheit: +2, Bildung: -1 }
    }
  },
  {
    id: 7,
    prompt: "Schwarzwald soll im großen Stil abgeholzt werden, um neue Ferienorte zu schaffen.",
    meta: "Finanzen",
    left: {
      label: "Zulassen",
      consequence: "Tourismus wächst, jedoch wird die Luftqualität deutlich schlechter.",
      effects: { Zufriedenheit: -2, Finanzen: +2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Natur bleibt erhalten, jedoch gehen viele potenzielle Arbeitsplätze verloren.",
      effects: { Finanzen: -2, Zufriedenheit: +2 }
    }
  },
  {
    id: 8,
    prompt: "Einfürung einer Brezel-Steuer zur Finanzierung der Straßen.",
    meta: "Finanzen",
    left: {
      label: "Zulassen",
      consequence: "Straßen werden saniert, jedoch ist der Zorn der Bäcker grenzenlos.",
      effects: { Zufriedenheit: -1, Finanzen: +2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Straßen bleiben kaputt, aber Brezeln bleiben günstig.",
      effects: { Sicherheit: -1, Zufriedenheit: +2 }
    }
  },
  {
    id: 9,
    prompt: "Ausbau des Stuttgarter Flughafens mitten in ein Naturschutzgebiet.",
    meta: "Finanzen",
    left: {
      label: "Zulassen",
      consequence: "Wirtschaft profitiert, Tierarten sterben aus.",
      effects: { Zufriedenheit: -1, Finanzen: +2, Bildung: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Umwelt bleibt intakt.",
      effects: { Zufriedenheit: +1, Bildung: +1 }
    }
  },
  {
    id: 10,
    prompt: "Der Bodensee soll teilweise privatisiert werden.",
    meta: "Finanzen",
    left: {
      label: "Zulassen",
      consequence: "Luxushotels übernehmen das Ufer.",
      effects: { Zufriedenheit: -2, Finanzen: +2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Ufer bleiben öffentlich.",
      effects: { Finanzen: -2, Zufriedenheit: +2 }
    }
  },
  {
    id: 11,
    prompt: "Die Kuckucksuhr soll als nationales Kulturerbe gefördert werden.",
    meta: "Bildung",
    left: {
      label: "Fördern",
      consequence: "Traditionen leben auf.",
      effects: { Zufriedenheit: +2, Finanzen: -1, Bildung: +1 }
    },
    right: {
      label: "Nicht fördern",
      consequence: "Handwerk stirbt langsam aus.",
      effects: { Zufriedenheit: -1, Finanzen: -1 }
    }
  },
  {
    id: 12,
    prompt: "Der Bahnhof in Stuttgart soll weiter vergrößert werden.",
    meta: "Finanzen",
    left: {
      label: "Vergrößern",
      consequence: "Baustelle bis 2038.",
      effects: { Zufriedenheit: -2, Finanzen: -1 }
    },
    right: {
      label: "Nicht vergrößern",
      consequence: "Chaos bleibt.",
      effects: { Finanzen: -1, Zufriedenheit: -1 }
    }
  },
  {
    id: 13,
    prompt: "Einführung einer Pflicht zum Tragen von Trachten an Feiertagen.",
    meta: "Zufriedenheit",
    left: {
      label: "Zulassen",
      consequence: "Jugend rebelliert.",
      effects: { Zufriedenheit: -1, Finanzen: +1, Bildung: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Touristen enttäuscht.",
      effects: { Finanzen: -1, Zufriedenheit: +1, Bildung: +1 }
    }
  },
  {
    id: 14,
    prompt: "Einführung eines Dialekt-Pflichtfaches in Schulen.",
    meta: "Bildung",
    left: {
      label: "Einführen",
      consequence: "Kinder schwätzen wieder schwäbisch.",
      effects: { Zufriedenheit: -1, Bildung: -2 }
    },
    right: {
      label: "Nicht einführen",
      consequence: "Dialekte sterben.",
      effects: { Zufriedenheit: -1, Bildung: +2 }
    }
  },
  {
    id: 15,
    prompt: "Freibäder sollen verboten werden, um Wasser zu sparen.",
    meta: "Sicherheit",
    left: {
      label: "Verbieten",
      consequence: "Private Pools explodieren.",
      effects: { Zufriedenheit: -1, Bildung: +1, Finanzen: -1, Sicherheit: -1 }
    },
    right: {
      label: "Nicht verbieten",
      consequence: "Rettungsschwimmer fehlen.",
      effects: { Zufriedenheit: +1, Finanzen: +1, Sicherheit: +1 }
    }
  },
  {
    id: 16,
    prompt: "Einführung des Schwobentalers – eigene Landeswährung.",
    meta: "Finanzen",
    left: {
      label: "Einführen",
      consequence: "Chaos an den Märkten.",
      effects: { Finanzen: -1, Zufriedenheit: -1, Bildung: +1 }
    },
    right: {
      label: "Nicht einführen",
      consequence: "Euro bleibt.",
      effects: { Finanzen: -1 }
    }
  },
  {
    id: 17,
    prompt: "Ausbau von Windrädern auf Schwarzwald-Gipfeln.",
    meta: "Finanzen",
    left: {
      label: "Bauen",
      consequence: "Strom günstiger, Anwohner genervt.",
      effects: { Finanzen: +2, Zufriedenheit: -1 }
    },
    right: {
      label: "Nicht bauen",
      consequence: "Strom teuer.",
      effects: { Finanzen: -1, Zufriedenheit: +1 }
    }
  },
  {
    id: 19,
    prompt: "Abschaffung des Bargelds.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Steuerhinterziehung sinkt.",
      effects: { Sicherheit: +1, Zufriedenheit: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Schattenwirtschaft wächst.",
      effects: { Sicherheit: -1, Zufriedenheit: +1 }
    }
  },
  {
    id: 20,
    prompt: "Verbot von Alkohol.",
    meta: "Zufriedenheit",
    left: {
      label: "Umsetzen",
      consequence: "Schwarzmarkt wächst.",
      effects: { Sicherheit: -1, Bildung: +1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Krankenhäuser voll.",
      effects: { Zufriedenheit: +1, Sicherheit: -1 }
    }
  },
  {
    id: 24,
    prompt: "Verbot von Religion.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Leere im Land.",
      effects: { Sicherheit: +1, Zufriedenheit: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Glaubensstreit eskaliert.",
      effects: { Sicherheit: -1, Zufriedenheit: +1 }
    }
  },
  {
    id: 25,
    prompt: "Einführung einer 4-Tage Woche.",
    meta: "Zufriedenheit",
    left: {
      label: "Umsetzen",
      consequence: "Leute haben mehr Freizeit, aber Wirtschaft leidet.",
      effects: { Zufriedenheit: +2, Finanzen: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Bevölkerung ist entäuscht.",
      effects: { Zufriedenheit: -1, Finanzen: +1 }
    }
  }
];


const RESCUE_CARDS = {
  Zufriedenheit: [
    { prompt: "Du kannst die Bevölkerung durch eine große Gratis-Show beruhigen.", left: { label: "Show finanzieren (-5 Finanzen)", effects: { Zufriedenheit: +4, Finanzen: -5 } }, right: { label: "Show absagen", effects: {} } },
    { prompt: "Du kannst eine landesweite PR-Kampagne starten.", left: { label: "Kampagne starten (-3 Bildung)", effects: { Zufriedenheit: +3, Bildung: -3 } }, right: { label: "Nicht starten", effects: {} } }
  ],
  Sicherheit: [
    { prompt: "Geheime Eliteeinheit einsetzen?", left: { label: "Einsetzen (-4 Finanzen)", effects: { Sicherheit: +4, Finanzen: -4 } }, right: { label: "Nein", effects: {} } },
    { prompt: "Strengere Gesetze erlassen?", left: { label: "Erlassen (-3 Zufriedenheit)", effects: { Sicherheit: +3, Zufriedenheit: -3 } }, right: { label: "Nein", effects: {} } }
  ],
  Bildung: [
    { prompt: "Elite-Unis fördern?", left: { label: "Fördern (-4 Finanzen)", effects: { Bildung: +4, Finanzen: -4 } }, right: { label: "Nein", effects: {} } },
    { prompt: "Unis von Experten leiten?", left: { label: "Einsetzen (-3 Zufriedenheit)", effects: { Bildung: +3, Zufriedenheit: -3 } }, right: { label: "Nein", effects: {} } }
  ],
  Finanzen: [
    { prompt: "Schwarze Kassen öffnen?", left: { label: "Öffnen (-4 Sicherheit)", effects: { Finanzen: +4, Sicherheit: -4 } }, right: { label: "Nein", effects: {} } },
    { prompt: "Einmalige Steuererhöhung?", left: { label: "Einführen (-3 Zufriedenheit)", effects: { Finanzen: +3, Zufriedenheit: -3 } }, right: { label: "Nein", effects: {} } }
  ]
};

const EVENT_DECK = [
  {
    id: "E1",
    prompt: "⚠️ Stromausfall im ganzen Land. Sofort reagieren?",
    left: { label: "Notfallplan aktivieren", consequence: "Strom kommt schneller zurück, kostet aber Geld.", effects: { Sicherheit: +1, Finanzen: -2, Zufriedenheit: +1 } },
    right:{ label: "Ignorieren", consequence: "Chaos, Plünderungen, Wut.", effects: { Sicherheit: -2, Zufriedenheit: -1 } },
    timeout:{ consequence: "Zu langsam. Das Chaos nimmt seinen Lauf.", effects: { Sicherheit: -2, Zufriedenheit: -1 , Finanzen: -1} }
  },
  {
    id: "E2",
    prompt: "⚠️ In deinem Land ensteht eine Rebellion!",
    left: { label: "Angreifen", consequence: "Du vernichtest sie und die Bevölkerung erzittert.", effects: { Sicherheit: +2, Finanzen: -1, Zufriedenheit: -2 } },
    right:{ label: "Verhandeln", consequence: "Ihr kommt auf einen Kompromiss, doch wirkt Schwach auf die Bevölkerung.", effects: { Sicherheit: -2, Zufriedenheit: +2 } },
    timeout:{ consequence: "Die Rebellen richten großen Schaden an.", effects: { Sicherheit: -1, Zufriedenheit: -1 , Finanzen: -1} }
  },
  {
    id: "E3",
    prompt: "⚠️ Skandalvideo über dich geht viral. Statement?",
    left: { label: "Abwiegeln", consequence: "Einige glauben es, andere werden misstrauisch.", effects: { Zufriedenheit: -1, Bildung: -1 } },
    right:{ label: "Transparenz", consequence: "Du wirkst menschlich, aber machst dich angreifbar.", effects: { Zufriedenheit: +1, Sicherheit: -1 } },
    timeout:{ consequence: "Kein Statement. Die Gerüchte gewinnen.", effects: { Zufriedenheit: -2 } }
  }
];

const GAME_OVER_MESSAGES = {
  Bildung: {
    low: "Dein Land ist verblödet. Es ist rückständig geworden und deine Bevölkerung bewirft sich auf offener Straße mit Kacke.",
    high: "Deine Bevölkerung ist zu schlau geworden. Sie durchschauen deine Tricks und lassen sich von niemandem regieren."
  },
  Sicherheit: {
    low: "Die niedrigen Sicherheitsstandards haben deine gierigen Nachbarn aufmerksam gemacht. Sie ziehen in den Krieg gegen dich und gewinnen.",
    high: "Du wurdest zu gierig. Du startest einen Krieg mit dem Nachbarland, verlierst jedoch."
  },
  Zufriedenheit: {
    low: "Die Leute waren unzufrieden mit dir. Du wirst von deinen engsten Beratern im Schlaf erschossen.",
    high: "Die Menschen sind fett und faul geworden. Keiner macht mehr seinen Job. Du wirst im Schlaf erschossen."
  },
  Finanzen: {
    low: "Krankenhäuser brechen zusammen. Alle werden krank und sterben an ihren Qualen.",
    high: "Das ganze Geld hat dich korrupt gemacht. Deine Bevölkerung lehnt sich gegen dich auf."
  }
};

/* ---------- Validation ---------- */
function validateData() {
  const known = new Set(CATEGORIES);
  const warn = (msg, obj) => console.warn(`[DATA] ${msg}`, obj);

  for (const card of DECK) {
    if (!card || typeof card !== "object") continue;
    if (card.meta && !known.has(card.meta)) warn(`Unbekannte meta-Kategorie "${card.meta}" (Karte id=${card.id})`, card);
    for (const s of ["left", "right"]) {
      const eff = card?.[s]?.effects;
      if (!eff) continue;
      for (const k of Object.keys(eff)) if (!known.has(k)) warn(`Unbekannte effects-Kategorie "${k}" (Karte id=${card.id}, side=${s})`, card);
    }
  }

  for (const ev of EVENT_DECK) {
    for (const s of ["left", "right", "timeout"]) {
      const eff = ev?.[s]?.effects;
      if (!eff) continue;
      for (const k of Object.keys(eff)) if (!known.has(k)) warn(`Unbekannte Event-effects-Kategorie "${k}" (Event id=${ev.id}, side=${s})`, ev);
    }
  }
}


function buildIllustrationForCard(cardData) {
  const src = CARD_IMAGES[cardData.id];
  if (!src) return null;

  const wrap = create("div", "illustration");

  const img = document.createElement("img");
  img.src = src;
  img.alt = `Illustration zu Karte ${cardData.id}`;
  img.loading = "eager";

  // Falls Datei fehlt -> Bildslot komplett entfernen (sauberer)
  img.addEventListener("error", () => {
    console.warn("[IMG] nicht gefunden:", src, "(Karte id=" + cardData.id + ")");
    wrap.remove();
  });

  wrap.appendChild(img);
  return wrap;
}











/* =========================================================
   Core: Random draw + State
   ========================================================= */

function sampleDeck(base, n) {
  const arr = base.slice();
  if (arr.length === 0) return [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

const state = {
  index: 0,
  history: [],
  scores: {
    Bildung: START_SCORE,
    Sicherheit: START_SCORE,
    Zufriedenheit: START_SCORE,
    Finanzen: START_SCORE
  },

  startScreenDone: false,
  introLineIndex: 0,
  introDone: false,

  playDeck: sampleDeck(DECK, 10),
  rescueUsed: false,

  eventActive: false,
  eventSeenThisTurn: false
};



/* =========================================================
   UI: progress & scoreboard
   ========================================================= */

function updateProgress() {
  const total = state.playDeck.length || 1;
  const p = Math.round((state.index / total) * 100);
  const bar = $("#bar");
  if (bar) bar.style.width = p + "%";
}

function updateBars() {
  for (const cat of CATEGORIES) {
    const el = document.getElementById("bar-" + cat);
    if (!el) continue;

    const val = state.scores[cat];
    const percent = (val / SCORE_MAX) * 100;

    el.style.width = percent + "%";
    el.style.background = "#FDF6EA"; // IMMER weiß
  }
}


/* =========================================================
   Points overlay
   ========================================================= */

function showPointsAnimation(effects) {
  const overlay = document.getElementById("points-overlay");
  if (!overlay) return;

  const wrap = document.createElement("div");
  wrap.className = "points-float";

  wrap.innerHTML = Object.entries(effects)
    .map(([cat, val]) => {
      const cls = val >= 0 ? "points-positive" : "points-negative";
      const sign = val >= 0 ? "+" : "";
      return `<div class="${cls}">${cat}: ${sign}${val}</div>`;
    })
    .join("");

  overlay.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1300);
}

/* =========================================================
   Volume
   ========================================================= */

function loadVolume() {
  const saved = localStorage.getItem(VOLUME_KEY);
  if (saved !== null) {
    const v = Number(saved);
    if (!Number.isNaN(v)) masterVolume = Math.min(1, Math.max(0, v));
  }
}

function setVolume(v01) {
  masterVolume = Math.min(1, Math.max(0, v01));
  localStorage.setItem(VOLUME_KEY, String(masterVolume));
  applyVolumeToAllSounds();
}

function initMusicToggle() {
  const btn = document.getElementById("music-toggle");
  if (!btn) return;

  updateMusicToggleBtn();
  btn.addEventListener("click", () => setMusicMuted(!musicMuted));
}


function initVolumeSlider() {
  const slider = document.getElementById("volume");
  if (!slider) return;

  slider.value = String(Math.round(masterVolume * 100));
  slider.addEventListener("input", () => setVolume(Number(slider.value) / 100));
}

/* =========================================================
   Sound
   ========================================================= */

let currentGameOverSound = null;

function stopCurrentSound() {
  if (!currentGameOverSound) return;
  currentGameOverSound.pause();
  currentGameOverSound.currentTime = 0;
  currentGameOverSound = null;
}

/* =========================================================
   Music System (Intro + Random Loop + Timer overlay)
   ========================================================= */

const MUSIC_INTRO = "./sounds/Intro.mpeg";
const MUSIC_POOL = [
  "./sounds/MusikZwei.mpeg",
  "./sounds/MusikDrei.mpeg",
  "./sounds/MusikVier.mpeg"
];

const TIMER_SOUND = "./sounds/Timer.wav";

let bgAudio = null;         // Hintergrundmusik (Intro + Pool)
let timerAudio = null;      // Timer-Sound (nur bei Event)
let bgPausedForTimer = false;
let musicStarted = false;

function applyVolumeToAllSounds() {
  const v = masterVolume;

  // GameOver
  if (currentGameOverSound) currentGameOverSound.volume = v;

  // Musik + Timer: wenn gemutet -> 0, sonst normal
  const mv = musicMuted ? 0 : v;
  if (bgAudio) bgAudio.volume = mv;
  if (timerAudio) timerAudio.volume = musicMuted ? 0 : Math.min(1, v * 0.9);
}


// Shuffle helper
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let musicQueue = [];
let queueIndex = 0;

function rebuildMusicQueue() {
  musicQueue = shuffle(MUSIC_POOL);
  queueIndex = 0;
}

function ensureBgAudio() {
  if (!bgAudio) {
    bgAudio = new Audio();
    bgAudio.preload = "auto";
    bgAudio.volume = masterVolume;

    bgAudio.addEventListener("ended", () => {
      // Wenn Intro fertig -> nächste aus Pool, danach immer weiter
      playNextBgTrack();
    });
  }
  return bgAudio;
}

function playNextBgTrack() {
  // Wenn wir gerade wegen Timer pausieren: NICHT wechseln
  if (bgPausedForTimer) return;

  if (musicQueue.length === 0 || queueIndex >= musicQueue.length) {
    rebuildMusicQueue();
  }

  const next = musicQueue[queueIndex++];
  const a = ensureBgAudio();
  a.src = next;
  a.currentTime = 0;

  a.play().catch((e) => console.warn("[MUSIC] play blocked:", e));
}

async function startGameMusic() {
  if (musicStarted) return;
  musicStarted = true;

  rebuildMusicQueue();

  const a = ensureBgAudio();
  a.src = MUSIC_INTRO;
  a.currentTime = 0;
  applyVolumeToAllSounds();

  try {
    await a.play();
    console.log("[MUSIC] Intro gestartet:", a.src);
  } catch (e) {
    console.warn("[MUSIC] Intro blocked/failed:", e);
  }
}


function pauseGameMusicForTimer() {
  if (!bgAudio) return;
  if (bgAudio.paused) return;

  bgPausedForTimer = true;
  bgAudio.pause();
}

function resumeGameMusicAfterTimer() {
  if (!bgAudio) {
    bgPausedForTimer = false;
    return;
  }

  bgPausedForTimer = false;

  // Wenn Musik schon beendet war oder keine Quelle: nächste Track starten
  if (!bgAudio.src) {
    playNextBgTrack();
    return;
  }

  bgAudio.play().catch((e) => console.warn("[MUSIC] resume blocked:", e));
}

function ensureTimerAudio() {
  if (!timerAudio) {
    timerAudio = new Audio(TIMER_SOUND);
    timerAudio.preload = "auto";
    timerAudio.loop = true;          // Timer soll durchlaufen
    timerAudio.volume = Math.min(1, masterVolume * 0.9);
  }
  return timerAudio;
}

function startTimerSound() {
  const t = ensureTimerAudio();
  applyVolumeToAllSounds();
  t.currentTime = 0;
  t.play().catch((e) => console.warn("[TIMER] play blocked:", e));
}

function stopTimerSound() {
  if (!timerAudio) return;
  timerAudio.pause();
  timerAudio.currentTime = 0;
}

function stopAllMusicAndTimer() {
  bgPausedForTimer = false;

  if (timerAudio) {
    timerAudio.pause();
    timerAudio.currentTime = 0;
  }

  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    bgAudio.src = "";
  }

  musicStarted = false;
}





const END_SOUND_FILES = {
  Finanzen: { high: "./sounds/FinanzenZuViel.wav", low: "./sounds/FinanzenZuWenig.wav" },
  Bildung: { high: "./sounds/BildungZuViel.wav", low: "./sounds/BildungZuWenig.wav" },
  Sicherheit: { high: "./sounds/SicherheitZuViel.wav", low: "./sounds/SicherheitZuWenig.wav" },
  Zufriedenheit: { high: "./sounds/ZufriedenheitZuViel.wav", low: "./sounds/ZufriedenheitZuWenig.wav" }
};



function playEndSound(cat, reason) {
  stopCurrentSound();

  const side = reason === "zu hoch" ? "high" : "low";
  const file = END_SOUND_FILES?.[cat]?.[side];

  if (!file) {
    console.warn("[SOUND] missing mapping for:", cat, reason);
    return;
  }

  currentGameOverSound = new Audio(file);
  currentGameOverSound.volume = masterVolume;
  currentGameOverSound.play().catch((err) => console.error("[SOUND] play failed:", file, err));
}

/* =========================================================
   Intro: Mascot Animation
   ========================================================= */

let introAnimIntervalId = null;

function clearIntroAnim() {
  if (introAnimIntervalId) {
    clearInterval(introAnimIntervalId);
    introAnimIntervalId = null;
  }
}

function playMascotSpeak(imgEl) {
  if (!imgEl) return;

  clearIntroAnim();

  let step = 0;
  const total = Math.max(1, INTRO_IMAGES_PER_LINE);

  introAnimIntervalId = setInterval(() => {
    step++;

    imgEl.src = (step % 2 === 0) ? MASCOT_FRAMES.talk : MASCOT_FRAMES.idle;

    if (step === total - 1) imgEl.src = MASCOT_FRAMES.blink;

    if (step >= total) {
      clearIntroAnim();
      imgEl.src = MASCOT_FRAMES.idle;
    }
  }, INTRO_FRAME_INTERVAL_MS);
}

/* =========================================================
   Event timers (global)
   ========================================================= */

let eventIntervalId = null;
let eventTimeoutId = null;

function clearEventTimers() {
  if (eventIntervalId) {
    clearInterval(eventIntervalId);
    eventIntervalId = null;
  }
  if (eventTimeoutId) {
    clearTimeout(eventTimeoutId);
    eventTimeoutId = null;
  }
}

/* =========================================================
   Game flow helpers
   ========================================================= */

function clampScore(v) {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, v));
}

function applyEffects(effects) {
  for (const [cat, val] of Object.entries(effects)) {
    if (state.scores[cat] === undefined) state.scores[cat] = START_SCORE;
    state.scores[cat] = clampScore(state.scores[cat] + val);
  }
}

function isGameOverValue(val) {
  return val <= SCORE_MIN || val >= SCORE_MAX;
}

function shouldTriggerRescue(cat, val) {
  return !state.rescueUsed && isGameOverValue(val);
}

function checkGameOverOrRescue() {
  for (const [cat, val] of Object.entries(state.scores)) {
    if (shouldTriggerRescue(cat, val)) {
      launchRescue(cat);
      return true;
    }
    if (isGameOverValue(val)) {
      const reason = val <= SCORE_MIN ? "zu niedrig" : "zu hoch";
      showGameOver(cat, reason);
      return true;
    }
  }
  return false;
}

/* =========================================================
   Event system
   ========================================================= */

function rollChance(p) {
  return Math.random() < p;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shouldTriggerEvent() {
  if (!EVENT_DECK.length) return false;
  if (state.eventActive) return false;
  if (state.eventSeenThisTurn) return false;
  return rollChance(EVENT_CHANCE_PER_TURN);
}

function renderEventCard(eventData) {
  state.eventActive = true;
  pauseGameMusicForTimer();
startTimerSound();

  state.eventSeenThisTurn = true;

  clearEventTimers();

  const board = $("#board");
  board.innerHTML = "";

  const card = create("article", "card event");

  const prompt = create("div", "prompt");
  prompt.textContent = eventData.prompt;

  const meta = create("div", "meta");
  meta.textContent = `⏳ ${EVENT_TIMER_SECONDS}s`;

  const choices = create("div", "choices");

  const btnLeft = create("button", "btn btn-left");
  btnLeft.textContent = `← ${eventData.left.label}`;

  const btnRight = create("button", "btn btn-right");
  btnRight.textContent = `${eventData.right.label} →`;

  let secondsLeft = EVENT_TIMER_SECONDS;
  let finished = false;

  const finalize = (side) => {
    if (finished) return;
    finished = true;

    state.eventActive = false;
    clearEventTimers();

    const pick = side === "timeout" ? eventData.timeout : eventData[side];
    const effects = pick?.effects || {};

    showPointsAnimation(effects);
    applyEffects(effects);

    state.history.push({
      id: eventData.id,
      choice: side,
      consequence: pick?.consequence || "",
      effects
    });

    updateBars();
    stopTimerSound();
resumeGameMusicAfterTimer();


    if (!checkGameOverOrRescue()) setTimeout(renderBoard, 300);
  };

  btnLeft.addEventListener("click", () => finalize("left"));
  btnRight.addEventListener("click", () => finalize("right"));

  eventIntervalId = setInterval(() => {
    secondsLeft--;
    meta.textContent = `⏳ ${Math.max(0, secondsLeft)}s`;
  }, 1000);

  eventTimeoutId = setTimeout(() => finalize("timeout"), EVENT_TIMER_SECONDS * 1000);

  choices.append(btnLeft, btnRight);
  card.append(prompt, meta, choices);
  board.appendChild(card);
}

/* =========================================================
   Rescue
   ========================================================= */

function launchRescue(cat) {
  state.rescueUsed = true;

  const options = RESCUE_CARDS[cat];
  if (!options || !options.length) {
    const reason = state.scores[cat] <= SCORE_MIN ? "zu niedrig" : "zu hoch";
    showGameOver(cat, reason);
    return;
  }

  const rescueCard = options[Math.floor(Math.random() * options.length)];

  clearEventTimers();
  state.eventActive = false;

  const board = $("#board");
  board.innerHTML = "";

  const card = create("article", "card rescue");

  const prompt = create("div", "prompt");
  prompt.textContent = "⚠️ Du stehst kurz vor dem Verlust!\n" + rescueCard.prompt;

  const choices = create("div", "choices");

  const btnLeft = create("button", "btn btn-left");
  btnLeft.textContent = rescueCard.left.label;

  const btnRight = create("button", "btn btn-right");
  btnRight.textContent = rescueCard.right.label;

  btnLeft.addEventListener("click", () => {
    applyEffects(rescueCard.left.effects || {});
    updateBars();

    if (isGameOverValue(state.scores[cat])) {
      const reason = state.scores[cat] <= SCORE_MIN ? "zu niedrig" : "zu hoch";
      showGameOver(cat, reason);
      return;
    }

    renderBoard();
  });

  btnRight.addEventListener("click", () => {
    if (isGameOverValue(state.scores[cat])) {
      const reason = state.scores[cat] <= SCORE_MIN ? "zu niedrig" : "zu hoch";
      showGameOver(cat, reason);
      return;
    }

    renderBoard();
  });

  choices.append(btnLeft, btnRight);
  card.append(prompt, document.createElement("div"), choices);
  board.appendChild(card);
}


function buildDecisionGallery(fullscreen = false) {
  const wrap = document.createElement("div");
  wrap.className = fullscreen ? "decision-gallery fullscreen-vertical" : "decision-gallery";

  const normalDecisions = state.history.filter(
    (h) => h && typeof h.id === "number" && (h.choice === "left" || h.choice === "right")
  );

  if (normalDecisions.length === 0) {
    wrap.innerHTML = `<p style="margin:0;">Keine Entscheidungen gespeichert.</p>`;
    return wrap;
  }

  for (const h of normalDecisions) {
    const map = DECISION_IMAGES[h.id];
    const src = map?.[h.choice];
    if (!src) continue;

    const page = document.createElement("div");
    page.className = "decision-page";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Entscheidung Karte ${h.id} (${h.choice})`;
    img.loading = "lazy";

    page.appendChild(img);
    wrap.appendChild(page);
  }

  return wrap;
}





/* =========================================================
   Game Over
   ========================================================= */

function showGameOver(cat, reason) {
  stopAllMusicAndTimer();  // << NEU

  clearEventTimers();
  clearIntroAnim();
  state.eventActive = false;

  playEndSound(cat, reason);

  const board = $("#board");
  board.innerHTML = "";

  const wrap = create("div", "card");
  wrap.style.display = "grid";
  wrap.style.placeItems = "center";

  const end = create("div", "end");

  const msgSet = GAME_OVER_MESSAGES[cat];
  const msg = msgSet
    ? (reason === "zu niedrig" ? msgSet.low : msgSet.high)
    : `Deine Politik hat ${cat} zerstört.`;

  end.innerHTML = `
    <h2>Spiel vorbei!</h2>
    <p><strong>${cat}</strong> ist ${reason} geworden.</p>
    <p>${msg}</p>
    <p style="margin-top:12px;"><strong>Deine Entscheidungen als Zeichnungen:</strong></p>
  `;

  end.appendChild(buildDecisionGallery(true)); // ✅ fullscreen-gallery

  end.insertAdjacentHTML("beforeend", `
    <div style="margin-top:14px;">
      <button class="btn" onclick="restart()">Neu starten</button>
    </div>
  `);

  wrap.appendChild(end);
  board.appendChild(wrap);

  const bar = $("#bar");
  if (bar) bar.style.width = "100%";
}



/* =========================================================
   Intro
   ========================================================= */

function renderStartScreen() {
  clearEventTimers();
  clearIntroAnim();

  const board = $("#board");
  board.innerHTML = "";

const card = create("article", "card start-screen");

  const prompt = create("div", "prompt");
prompt.textContent = "DAS DIKTATORSPIEL";


  const meta = create("div", "meta");
  meta.textContent = "Bereit, dein Land zu regieren?";

  const choices = create("div", "choices");
  choices.style.gridTemplateColumns = "1fr";

  const btn = create("button", "btn");
  btn.textContent = "Starten";

  btn.addEventListener("click", async () => {
  // Musik MUSS innerhalb dieses Klicks gestartet werden (Autoplay-Regel)
  await startGameMusic();

  state.startScreenDone = true;
  renderBoard();
});


  choices.appendChild(btn);
  card.append(prompt, meta, choices);
  board.appendChild(card);

  // Fortschritt zurücksetzen
  const bar = $("#bar");
  if (bar) bar.style.width = "0%";
}





function renderIntro() {
  clearEventTimers();
  clearIntroAnim();
  state.eventActive = false;

  const board = $("#board");
  board.innerHTML = "";

  const card = create("article", "card intro");

  // Mascot
  const mascot = document.createElement("img");
  mascot.className = "mascot";
  mascot.src = MASCOT_FRAMES.idle;
  mascot.alt = "Maskottchen";

  // Textbereich
  const prompt = create("div", "prompt intro-text");

  // Hint
  const hint = create("div", "intro-hint");

  // Buttons erst am Ende
  const choices = create("div", "choices");
  choices.style.display = "none";

  const btnLeft = create("button", "btn btn-left");
  btnLeft.textContent = "Verstanden";

  const btnRight = create("button", "btn btn-right");
  btnRight.textContent = "Alles klar";

  const closeIntro = () => {
    clearIntroAnim();
    state.introDone = true;
    renderBoard();
  };

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    closeIntro();
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    closeIntro();
  });

  choices.append(btnLeft, btnRight);

  function updateIntroView() {
    const i = state.introLineIndex;

    // Dialog-zeilen rendern (damit CSS .dialog-line greifen kann)
    prompt.innerHTML = INTRO_SENTENCES
      .slice(0, i + 1)
      .map((t) => `<div class="dialog-line">${t}</div>`)
      .join("");

    playMascotSpeak(mascot);

    const isLast = i >= INTRO_SENTENCES.length - 1;
    if (isLast) {
      hint.textContent = "";
      choices.style.display = "grid";
    } else {
      hint.textContent = "Klicke auf die Karte, um weiterzulesen …";
      choices.style.display = "none";
    }

    const bar = $("#bar");
    if (bar) bar.style.width = "0%";
  }

  // Klick auf Karte -> nächster Satz
  card.addEventListener("click", () => {
    if (state.introLineIndex < INTRO_SENTENCES.length - 1) {
      state.introLineIndex++;
      updateIntroView();
    }
  });

  updateIntroView();

  card.append(mascot, prompt, hint, choices);
  board.appendChild(card);
}

/* =========================================================
   Main render
   ========================================================= */

function renderBoard() {
  const board = $("#board");
  board.innerHTML = "";

  // 🟢 1. Start-Screen
  if (!state.startScreenDone) {
    renderStartScreen();
    return;
  }

  // 🟡 2. Intro mit Maskottchen
  if (!state.introDone) {
    renderIntro();
    return;
  }

  // 🔴 Safety: kein Deck
  if (!state.playDeck || state.playDeck.length === 0) {
    board.innerHTML = `
      <div class="card">
        <div class="end"><h2>Kein Fragen-Deck geladen</h2></div>
      </div>
    `;
    return;
  }

 // ✅ Sieg
if (state.index >= state.playDeck.length) {
  stopAllMusicAndTimer(); // << NEU

  clearEventTimers();
  clearIntroAnim();
  state.eventActive = false;

  const wrap = create("div", "card");
  wrap.style.display = "grid";
  wrap.style.placeItems = "center";

  const end = create("div", "end");

  end.innerHTML = `
    <h2>Gewonnen!</h2>
    <p>Du hast alle ${state.playDeck.length} Fragen beantwortet.</p>
    <p style="margin-top:12px;"><strong>Deine Entscheidungen als Zeichnungen:</strong></p>
  `;

  end.appendChild(buildDecisionGallery(true)); // ✅ fullscreen-gallery

  end.insertAdjacentHTML("beforeend", `
    <div style="margin-top:14px;">
      <button class="btn" onclick="restart()">Nochmal spielen</button>
    </div>
  `);

  wrap.appendChild(end);
  board.appendChild(wrap);

  const bar = $("#bar");
  if (bar) bar.style.width = "100%";
  return;
}


  // ⚡ Event-Interrupt
  if (shouldTriggerEvent()) {
    const ev = pickRandom(EVENT_DECK);
    renderEventCard(ev);
    return;
  }

  // 🎴 Normale Karte
  const cardData = state.playDeck[state.index];

  const card = create("article", "card");

  // Bildslot (optional)
  const illu = buildIllustrationForCard(cardData);
  if (illu) card.classList.add("has-illu");

  const prompt = create("div", "prompt");
  prompt.textContent = cardData.prompt;

  const spacer = create("div");
  const choices = create("div", "choices");

  const btnLeft = create("button", "btn btn-left");
  btnLeft.textContent = `← ${cardData.left.label}`;

  const btnRight = create("button", "btn btn-right");
  btnRight.textContent = `${cardData.right.label} →`;

  btnLeft.addEventListener("click", () => decide("left", cardData));
  btnRight.addEventListener("click", () => decide("right", cardData));

  choices.append(btnLeft, btnRight);

  // Reihenfolge: Prompt -> Bild -> Spacer -> Buttons
  if (illu) {
    card.append(prompt, illu, spacer, choices);
  } else {
    card.append(prompt, spacer, choices);
  }

  board.appendChild(card);

  updateProgress();
  updateBars();
} // ✅ renderBoard endet hier


/* =========================================================
   Decision (normale Frage)
   ========================================================= */

function decide(side, data) {
  const pick = data[side];
  const effects = pick.effects || {};

  state.eventSeenThisTurn = false;

  showPointsAnimation(effects);
  applyEffects(effects);

  state.history.push({
    id: data.id,
    choice: side,
    consequence: pick.consequence,
    effects
  });

  state.index++;
  updateBars();

  if (!checkGameOverOrRescue()) setTimeout(renderBoard, 180);
}

/* =========================================================
   Restart
   ========================================================= */

function restart() {
  clearEventTimers();
  clearIntroAnim();
  stopCurrentSound();

  state.index = 0;
  state.history = [];
  state.scores = {
    Bildung: START_SCORE,
    Sicherheit: START_SCORE,
    Zufriedenheit: START_SCORE,
    Finanzen: START_SCORE
  };

  state.playDeck = sampleDeck(DECK, 10);
  state.rescueUsed = false;

  state.startScreenDone = false;
  state.introDone = false;
  state.introLineIndex = 0;

  state.eventActive = false;
  state.eventSeenThisTurn = false;

  renderBoard();
  updateBars();
}


/* =========================================================
   Boot
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadVolume();
  loadMusicMute();       // <- NEU
  initVolumeSlider();
  initMusicToggle();     // <- NEU

  validateData();
  renderBoard();
  updateBars();
});
