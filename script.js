
let currentGameOverSound = null;


const CATEGORIES = ["Bildung", "Sicherheit", "Zufriedenheit", "Finanzen"];


const DECK = [
  {
    id: 1,
    prompt: "Bauern fordern Subventionen (finanzielle unterstützung) für die Schweinezucht.",
    meta: "Finanzen",
    left:  {
      label: "Sie bekommen das Geld",
      consequence: "Bauern werden fett und faul. Cholesterinrate steigt im Land.",
      effects: { Finanzen: -2, Zufriedenheit: +2, Bildung: -1 }
    },
    right: {
      label: "Sie bekommen kein Geld",
      consequence: "Bauern und Schweine streiken. Veganer Partei gewinnt nächste Wahl.",
      effects: { Finanzen: +1, Zufriedenheit: -2 }
    }
  },
  {
    id: 2,
    prompt: "Polizei fordert doppelt so viel Geld, um Bevölkerung besser zu kontrolieren.",
    meta: "Sicherheit",
    left:  {
      label: "Finanzieren",
      consequence: "Land ist sicherer, aber niemand traut sich mehr aus dem Haus.",
      effects: { Sicherheit: +2, Zufriedenheit:-2, Finanzen: -1 }
    },
    right: {
      label: "Nicht Finanzieren",
      consequence: "Menschen trauen sich weiterhin raus, Verbrechensrate bleibt hoch.",
      effects: { Sicherheit: -1, Zufriedenheit: +2 }
    }
  },
  {
    id: 3,
    prompt: "Wissenschaftler wollen Klone für die Arbeit züchten.",
    meta: "Finanzen",
    left:  {
      label: "Zustimmen",
      consequence: "Wirtschaft boomt, jedoch weiß keiner, wer das Original ist.",
      effects: { Finanzen: +2, Bildung: +1, Zufriedenheit: -1, Sicherheit: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Forschung wandert ab. Weniger Wachstum, weniger ethische Konflikte.",
      effects: { Finanzen: -1, Zufriedenheit: +2, Bildung: -1 }
    }
  },
  {
    id: 4,
    prompt: "Alle Social-Media-Nachrichten sollen überwacht werden.",
    meta: "Zufriedenheit",
    left:  {
      label: "Zulassen",
      consequence: "Bürger haben Angst, ihre Meinung zu äußern.",
      effects: { Sicherheit: +2, Zufriedenheit: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Freie Chats; Inhalte bleiben ungefiltert.",
      effects: { Sicherheit: -1, Zufriedenheit: +2 }
    }
  },
  {
    id: 5,
    prompt: "Schüler fordern kostenlosen Nahverkehr zur Schule.",
    meta: "Bildung",
    left:  {
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
      effects: { Sicherheit: -2, Zufriedenheit: -1, Finanzen: +1  }
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
      consequence: "Straßen werden saniert, jedoch ist der Zorn der Bäcker grenzenlos. Der Preis der Brezel steigt auf 5€.",
      effects: { Zufriedenheit: -1, Finanzen: +2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Die Straßen sind weiterhin kaputt, jedoch können die Bürger in Ruhe ihre Brezeln frühstücken.",
      effects: { Sicherheit: -1, Zufriedenheit: +2 }
    }
  },
  {
    id: 9,
    prompt: "Ausbau des Stuttgarter Flughafens mitten in ein Naturschutzgebiet.",
    meta: "Finanzen",
    left: {
      label: "Zulassen",
      consequence: "Wirtschaft profitiert, jedoch sterben seltene Tierarten aus. Demonstranten gehen auf die Straße.",
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
      consequence: "Luxushotels krallen sich die Grundstücke. Bodensee darf nur noch gegen Gebühr betreten werden.",
      effects: { Zufriedenheit: -2, Finanzen: +2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Ufer bleiben öffentlich, jedoch gehen eine Menge Einnahmen verloren.",
      effects: { Finanzen: -2, Zufriedenheit: +2 }
    }
  },
  {
    id: 11,
    prompt: "Die Kuckucksuhr soll als nationales Kulturerbe gefördert werden.",
    meta: "Bildung",
    left: {
      label: "Fördern",
      consequence: "Traditionen leben auf, jedoch leidet das Budget an der Uhrenoffensive.",
      effects: { Zufriedenheit: +2, Finanzen: -1, Bildung: +1 }
    },
    right: {
      label: "Nicht fördern",
      consequence: "Alte Handwerksbetriebe sterben aus. Bevölkerung ist enttäuscht.",
      effects: { Zufriedenheit: -1, Finanzen: -1 }
    }
  },
  {
    id: 12,
    prompt: "Der Bahnhof in Stuttgart soll weiter vergrößert werden.",
    meta: "Finanzen",
    left: {
      label: "Vergrößern",
      consequence: "Baustelle wird endlich fertig – 2038. Bürger sind wütend.",
      effects: { Zufriedenheit: -2, Finanzen: -1 }
    },
    right: {
      label: "Nicht vergrößern",
      consequence: "Es herrscht weiterhin absolutes Chaos.",
      effects: { Finanzen: -1, Zufriedenheit: -1 }
    }
  },
  {
    id: 13,
    prompt: "Einführung einer Pflicht zum Tragen von Trachten an Feiertagen.",
    meta: "Zufriedenheit",
    left: {
      label: "Zulassen",
      consequence: "Heimatgefühl wächst, aber Individualisten und Jugendliche rebellieren.",
      effects: { Zufriedenheit: -1, Finanzen: +1, Bildung: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Modefreiheit bleibt, aber Touristen beschweren sich über den fehlenden Flair.",
      effects: { Finanzen: -1, Zufriedenheit: +1, Bildung: +1 }
    }
  },
  {
    id: 14,
    prompt: "Einführung eines Dialekt-Pflichtfaches in Schulen.",
    meta: "Bildung",
    left: {
      label: "Einführen",
      consequence: "Kinder reden wieder schwäbisch. D‘Kender schwätzad etz wieder Schwäbisch. D‘Lehrer send am Verzweifla bei de Grammatikaufgab.",
      effects: { Zufriedenheit: -1, Bildung: -2 }
    },
    right: {
      label: "Nicht einführen",
      consequence: "Hochdeutsch setzt sich durch und Dialekte sterben aus.",
      effects: { Zufriedenheit: -1, Bildung: +2 }
    }
  },
    {
    id: 16,
    prompt: "Einführung des 'Schwobentalers' – eigene Landeswährung.",
    meta: "Finanzen",
    left:  {
      label: "Einführen",
      consequence: "Wirtschaft steht auf dem Kopf. Schwobentaler geht nach hinten los. Menschen beschäftigen sichh mehr mit Finanzen",
      effects: { Finanzen: -1, Zufriedenheit: -1, Bildung: +1 }
    },
    right: {
      label: "Nicht Einführen",
      consequence: "Euro bleibt stabil, jedoch beschäftigt sich niemand mit der Wirtschaft",
      effects: { Finanzen: -1 }
    }
  },
    {
    id: 17,
    prompt: "Ausbau von Windräden auf Schwarzwald-Gipfeln.",
    meta: "Finanzen",
    left:  {
      label: "Bauen",
      consequence: "Strompreise sind deutlich günstiger, aber die Anwohner sind genervt von den Baustellen",
      effects: { Finanzen: +2, Zufriedenheit: -1,}
    },
    right: {
      label: "Nicht Bauen",
      consequence: "Strompreise explodierenm jedoch bleibt Natur erhalten",
      effects: { Finanzen: -1, Zufriedenheit: +1 }
    }
  },
    {
    id: 18,
    prompt: "Verstaatlichung aller Banken.",
    meta: "Finanzen",
    left: {
      label: "Umsetzen",
      consequence: "Staat kontrolliert das Geld, Bürokratie explodiert.",
      effects: { Finanzen: -1, Zufriedenheit: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Reiche werden reicher, Bürger fühlen sich ohnmächtig.",
      effects: { Finanzen: +1, Zufriedenheit: -1 }
    }
  },
  {
    id: 19,
    prompt: "Abschaffung des Bargelds.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Steuerhinterziehung sinkt, ältere Menschen überfordert.",
      effects: { Sicherheit: +1, Zufriedenheit: -1 } 
    },
    right: {
      label: "Ablehnen",
      consequence: "Schattenwirtschaft boomt.",
      effects: { Sicherheit: -1, Zufriedenheit: +1 }
    }
  },
  {
    id: 20,
    prompt: "Verbot von Alkohol.",
    meta: "Gesundheit",
    left: {
      label: "Umsetzen",
      consequence: "Produktivität steigt, Schwarzmarkt wächst.",
      effects: { Sicherheit: -1, Bildung: +1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Bürger feiern, Krankenhäuser voll.",
      effects: { Zufriedenheit: +1, Sicherheit: -1 }
    }
  },
  {
    id: 21,
    prompt: "Einführung einer Ehepflicht.",
    meta: "Zufriedenheit",
    left: {
      label: "Umsetzen",
      consequence: "Hochzeiten überall, Scheidungen explodieren.",
      effects: { Zufriedenheit: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Freiheit bleibt, Geburtenrate sinkt.",
      effects: { Zufriedenheit: +1 }
    }
  },
  {
    id: 22,
    prompt: "Jeder Bürger muss einen Baum pflanzen.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Städte werden grün, aber Organisation kostet Milliarden.",
      effects: { Sicherheit: +1, Finanzen: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Umwelt bleibt trist.",
      effects: { Zufriedenheit: -1, Sicherheit: -1 }
    }
  },

 {
    id: 23,
    prompt: "Einführung von Uniformen für alle Bürger.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Ordnung steigt, Individualität verschwindet.",
      effects: { Sicherheit: +1, Zufriedenheit: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Vielfalt bleibt, aber Neid wächst.",
      effects: { Sicherheit: -1, Zufriedenheit: +1 }
    }
  },
   {
    id: 24,
    prompt: "Verbot von Religion.",
    meta: "Sicherheit",
    left: {
      label: "Umsetzen",
      consequence: "Weniger Konflikte, Menschen fühlen Leere.",
      effects: { Sicherheit: +1, Zufriedenheit: -2 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Vielfalt blüht, Glaubensstreit eskaliert.",
      effects: { Sicherheit: -1, Zufriedenheit: +1 }
    }
  },

{
    id: 25,
    prompt: "Erhöhung der Staatsausgaben für Propaganda.",
    meta: "Zufriedenheit",
    left: {
      label: "Umsetzen",
      consequence: "Alle Medien loben dich, niemand glaubt ihnen.",
      effects: { Zufriedenheit: -1, Bildung: -1 }
    },
    right: {
      label: "Ablehnen",
      consequence: "Presse bleibt kritisch, Beliebtheit sinkt.",
      effects: { Zufriedenheit: -1, Bildung: +1 }
    }
  },

  {
    id: 15,
    prompt: "Freibäder sollen verboten werden, um Wasser zu sparen und Unfälle zu vermeiden.",
    meta: "Sicherheit",
    left: {
      label: "Verbieten",
      consequence: "Die Bevölkerung hat angefangen, eigene Pools zu bauen, wodurch es zu vielen Verletzten gekommen ist.",
      effects: { Zufriedenheit: -1, Bildung: +1, Finanzen: -1, Sicherheit: -1 }
    },
    right: {
      label: "Nicht verbieten",
      consequence: "Die Nachfrage nach Schwimmbädern schoss in die Höhe. Noch nie wurden so viele Rettungsschwimmer benötigt.",
      effects: { Zufriedenheit: +1, Finanzen: +1, Sicherheit: +1 }
    }
  }
];


const RESCUE_CARDS = {
  Zufriedenheit: [
    {
      prompt: "Du kannst die Bevölkerung durch eine große Gratis-Show beruhigen.",
      left:  { label: "Show finanzieren (-5 Finanzen)", effects: { Zufriedenheit: +4, Finanzen: -5 }},
      right: { label: "Show absagen", effects: {} }
    },
    {
      prompt: "Du kannst eine landesweite PR-Kampagne starten.",
      left:  { label: "Kampagne starten (-3 Bildung)", effects: { Zufriedenheit: +3, Bildung: -3 }},
      right: { label: "Nicht starten", effects: {} }
    }
  ],

  Sicherheit: [
    {
      prompt: "Geheime Eliteeinheit einsetzen?",
      left:  { label: "Einsetzen (-4 Finanzen)", effects: { Sicherheit: +4, Finanzen: -4 }},
      right: { label: "Nein", effects: {} }
    },
    {
      prompt: "Strengere Gesetze erlassen?",
      left:  { label: "Erlassen (-3 Zufriedenheit)", effects: { Sicherheit: +3, Zufriedenheit: -3 }},
      right: { label: "Nein", effects: {} }
    }
  ],

  Bildung: [
    {
      prompt: "Elite-Unis fördern?",
      left:  { label: "Fördern (-4 Finanzen)", effects: { Bildung: +4, Finanzen: -4 }},
      right: { label: "Nein", effects: {} }
    },
    {
      prompt: "Unis von Experten leiten?",
      left:  { label: "Einsetzen (-3 Zufriedenheit)", effects: { Bildung: +3, Zufriedenheit: -3 }},
      right: { label: "Nein", effects: {} }
    }
  ],

  Finanzen: [
    {
      prompt: "Schwarze Kassen öffnen?",
      left:  { label: "Öffnen (-4 Sicherheit)", effects: { Finanzen: +4, Sicherheit: -4 }},
      right: { label: "Nein", effects: {} }
    },
    {
      prompt: "Einmalige Steuererhöhung?",
      left:  { label: "Einführen (-3 Zufriedenheit)", effects: { Finanzen: +3, Zufriedenheit: -3 }},
      right: { label: "Nein", effects: {} }
    }
  ]
};


// --- Soundeffekte für Game Over / Rettung (WAV) ---
const END_SOUNDS = {
  Finanzen: {
    high: new Audio('sounds/FinanzenZuViel.wav'),
    low:  new Audio('sounds/FinanzenZuWenig.wav')
  },
  Bildung: {
    high: new Audio('sounds/BildungZuViel.wav'),
    low:  new Audio('sounds/BildungZuWenig.wav')
  },
  Sicherheit: {
    high: new Audio('sounds/SicherheitZuViel.wav'),
    low:  new Audio('sounds/SicherheitZuWenig.wav')
  },
  Zufriedenheit: {
    high: new Audio('sounds/ZufriedenheitZuViel.wav'),
    low:  new Audio('ZufriedenheitZuWenig.wav')
  }
};

function playEndSound(cat, reason) {
  const side = reason === 'zu niedrig' ? 'low' : 'high';
  const sound = END_SOUNDS[cat] && END_SOUNDS[cat][side];
  if (!sound) return;

  try {
    sound.currentTime = 0;
    sound.play();
  } catch (e) {
    console.error("Sound konnte nicht abgespielt werden:", cat, reason, e);
  }
}





// --- Zufällige Karten ziehen ---
function sampleDeck(base, n) {
  const arr = base.slice();
  if (arr.length === 0) return [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

// --- Spielzustand ---
const state = {
  index: 0,
  history: [],
  scores: { Bildung: 5, Sicherheit: 5, Zufriedenheit: 5, Finanzen: 5 },
  playDeck: sampleDeck(DECK, 10),
  rescueUsed: false,
  pendingRescue: false   // <<< neu
};



// --- Hilfsfunktionen ---
const $ = (sel, el=document) => el.querySelector(sel);
const create = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

function updateProgress() {
  const p = Math.round((state.index / state.playDeck.length) * 100);
  $('#bar').style.width = p + '%';
}

function updateBars() {
  for (const cat of CATEGORIES) {
    const el = document.getElementById('bar-' + cat);
    if (!el) continue;
    const val = state.scores[cat];
    const percent = (val / 10) * 100;
    el.style.width = percent + '%';
    el.style.background = val <= 2 || val >= 8 ? '#ff1d1d' : 'linear-gradient(90deg, #ff5864, #ff9a56)';
  }
}

// --------------------------------------------------------------
//  PUNKTE-ANIMATION (NEU)
// --------------------------------------------------------------
function showPointsAnimation(effects) {
  const board = document.getElementById("board");

  const wrap = document.createElement("div");
  wrap.className = "points-float";

  wrap.innerHTML = Object.entries(effects)
    .map(([cat, val]) => {
      const cls = val > 0 ? "points-positive" : "points-negative";
      const sign = val > 0 ? "+" : "";
      return `<div class="${cls}">${sign}${val} ${cat}</div>`;
    })
    .join("");

  board.appendChild(wrap);

  setTimeout(() => wrap.remove(), 5000);
}
// --------------------------------------------------------------

function checkGameOver() {
  for (const [cat, val] of Object.entries(state.scores)) {

    // Rettung zuerst abfangen
    if (!state.rescueUsed && (val <= 0 || val >= 10)) {
      launchRescue(cat);
      return true;
    }

    // echtes Game Over NACH Rettung
    if (val <= 0 || val >= 10) {
      const reason = val <= 0 ? "zu niedrig" : "zu hoch";
      showGameOver(cat, reason);  // Sound kommt dort rein
      return true;
    }
  }
  return false;
}




function launchRescue(cat) {
  state.rescueUsed = true;
  state.pendingRescue = true;

  const options = RESCUE_CARDS[cat];
  const rescueCard = options[Math.floor(Math.random() * options.length)];

  const board = document.getElementById("board");
  board.innerHTML = "";

  const card = create("article", "card rescue above"); // <<< direkt rescue setzen

  const prompt = create("div", "prompt");
  prompt.textContent = "⚠️ Du stehst kurz vor dem Verlust!\n" + rescueCard.prompt;

  const choices = create("div", "choices");

  const btnLeft = create("button", "btn btn-left");
  btnLeft.textContent = rescueCard.left.label;
  
  const btnRight = create("button", "btn btn-right");
  btnRight.textContent = rescueCard.right.label;

  btnLeft.addEventListener("click", () => {
    applyRescueEffects(rescueCard.left.effects);
    state.pendingRescue = false;
    renderBoard();
  });

  btnRight.addEventListener("click", () => {
    state.pendingRescue = false; 
    renderBoard();
  });

  choices.append(btnLeft, btnRight);

  card.append(prompt, document.createElement("div"), choices);
  board.appendChild(card);
}


function applyRescueEffects(effects) {
  for (const [cat, val] of Object.entries(effects)) {
    state.scores[cat] += val;
    state.scores[cat] = Math.max(0, Math.min(10, state.scores[cat]));
  }

  updateBars();
  state.pendingRescue = false;
}




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


function showGameOver(cat, reason) {

  // 🎵 SOUND HIER – und NUR HIER
  playEndSound(cat, reason);

  const board = $('#board');
  board.innerHTML = '';
  const wrap = create('div', 'card');
  wrap.style.display = 'grid';
  wrap.style.placeItems = 'center';
  const end = create('div', 'end');

  const msgSet = GAME_OVER_MESSAGES[cat];
  let msg = msgSet
    ? (reason === "zu niedrig" ? msgSet.low : msgSet.high)
    : `Deine Politik hat ${cat} zerstört.`;

  end.innerHTML = `
    <h2>Spiel vorbei!</h2>
    <p><strong>${cat}</strong> ist ${reason} geworden.</p>
    <p>${msg}</p>
    <button class="btn" onclick="restart()">Neu starten</button>
  `;
  wrap.appendChild(end);
  board.appendChild(wrap);
}




function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hide);
  t._hide = setTimeout(() => t.classList.remove('show'), 1700);
}




// --------------------------------------------------------------
//  ENTSCHEIDUNG MIT PUNKTE-ANIMATION (ANGEPAST)
// --------------------------------------------------------------
function decide(side, data) {
  const pick = data[side];
  const eff = pick.effects || {};

  // Punktanimation GLOBAL anzeigen
  showPointsAnimation(eff);

  // Werte ändern
  for (const [cat, val] of Object.entries(eff)) {
    if (state.scores[cat] === undefined) state.scores[cat] = 5;
    state.scores[cat] += val;
    state.scores[cat] = Math.max(0, Math.min(10, state.scores[cat]));
  }

  state.history.push({ id: data.id, choice: side, consequence: pick.consequence, effects: eff });
// showToast(pick.consequence);


  state.index++;
  updateBars();

  if (!checkGameOver()) setTimeout(renderBoard, 180);
}






function showPointsAnimation(effects) {
  const overlay = document.getElementById('points-overlay');
  if (!overlay) return;

  const wrap = document.createElement('div');
  wrap.className = "points-float";

  let html = "";
  for (const [cat, val] of Object.entries(effects)) {
    const cls = val >= 0 ? "points-positive" : "points-negative";
    // Kategorie + Wert anzeigen
    html += `<div class="${cls}">${cat}: ${val >= 0 ? "+" : ""}${val}</div>`;
  }

  wrap.innerHTML = html;
  overlay.appendChild(wrap);

  // Nach der Animation wieder entfernen
  setTimeout(() => wrap.remove(), 2300);
}





function restart() {
   // 🎵 Laufenden GameOver-Sound stoppen
  if (currentGameOverSound) {
    currentGameOverSound.pause();
    currentGameOverSound.currentTime = 0;
    currentGameOverSound = null;
  }
  state.index = 0;
  state.history = [];
  state.scores = { Bildung: 5, Sicherheit: 5, Zufriedenheit: 5, Finanzen: 5 };
  state.playDeck = sampleDeck(DECK, 10);
  state.rescueUsed = false;
  state.pendingRescue = false;

  renderBoard();
  updateBars();
}


function playEndSound(cat, reason) {
  // Wenn bereits ein Sound läuft → stoppen
  if (currentGameOverSound) {
    currentGameOverSound.pause();
    currentGameOverSound.currentTime = 0;
  }

  let file = "";

  if (cat === "Finanzen") {
    file = reason === "zu hoch" ? "FinanzenZuViel.WAV" : "FinanzenZuWenig.WAV";
  }
  if (cat === "Bildung") {
    file = reason === "zu hoch" ? "BildungZuViel.WAV" : "BildungZuWenig.WAV";
  }
  if (cat === "Sicherheit") {
    file = reason === "zu hoch" ? "SicherheitZuViel.WAV" : "SicherheitZuWenig.WAV";
  }
  if (cat === "Zufriedenheit") {
    file = reason === "zu hoch" ? "ZufriedenheitZuViel.WAV" : "ZufriedenheitZuWenig.WAV";
  }

  currentGameOverSound = new Audio(file);
  currentGameOverSound.volume = 1.0;
  currentGameOverSound.play().catch(() => {});
}





function renderBoard() {
  const board = $('#board');
  board.innerHTML = '';

  if (!state.playDeck || state.playDeck.length === 0) {
    board.innerHTML = `
      <div class="card">
        <div class="end"><h2>Kein Fragen-Deck geladen</h2></div>
      </div>
    `;
    return;
  }

  if (state.index >= state.playDeck.length) {
    const wrap = create('div', 'card');
    wrap.style.display = 'grid';
    wrap.style.placeItems = 'center';
    const end = create('div', 'end');

    const scoreList = Object.entries(state.scores)
      .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
      .join('');

    const historyText = state.history.map(h => h.consequence).join(' ');

    end.innerHTML = `
      <h2>Gewonnen!</h2>
      <p>Du hast alle ${state.playDeck.length} Fragen beantwortet.</p>
      <p><strong>Endstand:</strong></p>
      <div>${scoreList}</div>
      <p style="margin-top:12px;"><strong>Deine Entscheidungen hatten folgende Folgen:</strong></p>
      <p style="text-align:justify; max-width:560px; margin:0 auto 16px;">${historyText}</p>
      <button class="btn" onclick="restart()">Nochmal spielen</button>
    `;

    wrap.appendChild(end);
    board.appendChild(wrap);
    $('#bar').style.width = '100%';
    return;
  }

  // Karte
  const cardData = state.playDeck[state.index];
  
  let cardClass = 'card above';
if (state.pendingRescue) cardClass = 'card rescue above';
const card = create('article', cardClass);



  const prompt = create('div', 'prompt');
  prompt.textContent = cardData.prompt;

  const spacer = create('div');

  const choices = create('div', 'choices');

  const btnLeft = create('button', 'btn btn-left');
  btnLeft.textContent = `← ${cardData.left.label}`;

  const btnRight = create('button', 'btn btn-right');
  btnRight.textContent = `${cardData.right.label} →`;

  btnLeft.addEventListener('click', () => decide('left', cardData));
  btnRight.addEventListener('click', () => decide('right', cardData));

  choices.append(btnLeft, btnRight);

  card.append(prompt, spacer, choices);
  board.appendChild(card);

  updateProgress();
  updateBars();
}

// --- Start ---
renderBoard();
updateBars();

