import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

// 👉 Remplace ce numéro par le tien (format international, sans + ni espaces)
const WHATSAPP_NUMBER = "33600000000";

// ═══════════════════════════════════════════════════════════════════════════════
// 💰 LIENS D'AFFILIATION
// ═══════════════════════════════════════════════════════════════════════════════
// Pour toucher tes commissions, remplace les URLs ci-dessous par tes liens
// trackés (Awin, Effiliation, TimeOne, CJ Affiliate...).
//
// Format type : "https://www.awin1.com/cread.php?awinmid=XXXX&awinaffid=TON-ID&..."
//
// Si une clé n'est pas remplie, on utilise l'URL par défaut renvoyée par l'IA.
// ═══════════════════════════════════════════════════════════════════════════════
const AFFILIATE_LINKS = {
  // Mobile
  "Free Mobile":      "", // ex: "https://www.awin1.com/cread.php?awinmid=...&awinaffid=TON-ID"
  "Bouygues":         "",
  "SFR":              "",
  "RED by SFR":       "",
  "Sosh":             "",
  "Orange":           "",
  "NRJ Mobile":       "",
  "Lebara":           "",
  // Internet
  "Free":             "",
  // Énergie
  "EDF":              "",
  "Engie":            "",
  "TotalEnergies":    "",
  "Vattenfall":       "",
  "Ekwateur":         "",
  "Ilek":             "",
  // Assurances
  "AXA":              "",
  "Maif":             "",
  "Macif":            "",
  "Allianz":          "",
  "MMA":              "",
  "Groupama":         "",
  "Luko":             "",
  "April":            "",
  "Direct Assurance": "",
  "Leocare":          "",
};

// Helper: si on a un lien d'affiliation pour ce fournisseur, on l'utilise
const getAffiliateUrl = (providerName, fallbackUrl) => {
  const matchKey = Object.keys(AFFILIATE_LINKS).find(
    k => providerName?.toLowerCase().includes(k.toLowerCase())
  );
  return (matchKey && AFFILIATE_LINKS[matchKey]) || fallbackUrl || "#";
};

const CATEGORY_LABELS = {
  mobile:         { label: "Téléphone Mobile",      icon: "📱", color: "#00C8FF" },
  energy:         { label: "Énergie / Électricité", icon: "⚡", color: "#FFA500" },
  internet:       { label: "Internet / Box",         icon: "🌐", color: "#00E5C7" },
  insurance_home: { label: "Assurance Habitation",   icon: "🏠", color: "#FF5670" },
  insurance_auto: { label: "Assurance Auto",         icon: "🚗", color: "#7B5BFF" },
};

const CATEGORY_FORMS = {
  mobile: [
    { key: "provider",   label: "Opérateur actuel",        type: "select", options: ["Orange","SFR","Bouygues","Free Mobile","Sosh","RED by SFR","NRJ Mobile","Lebara","Autre"] },
    { key: "price",      label: "Prix mensuel (€)",        type: "number", placeholder: "Ex : 24.99" },
    { key: "data",       label: "Data incluse",            type: "select", options: ["Moins de 5 Go","5 Go","10 Go","20 Go","50 Go","100 Go","200 Go","300 Go ou +","Illimitée"] },
    { key: "calls",      label: "Appels & SMS",            type: "select", options: ["Illimités","Limités"] },
    { key: "roaming",    label: "Roaming Europe inclus ?", type: "select", options: ["Oui","Non","Je ne sais pas"] },
    { key: "commitment", label: "Engagement",              type: "select", options: ["Sans engagement","12 mois","24 mois"] },
    { key: "network",    label: "Réseau",                  type: "select", options: ["5G","4G+","4G","Je ne sais pas"] },
  ],
  energy: [
    { key: "provider",    label: "Fournisseur actuel",      type: "select", options: ["EDF","Engie","TotalEnergies","Vattenfall","Ekwateur","Ilek","Autre"] },
    { key: "price",       label: "Prix mensuel estimé (€)", type: "number", placeholder: "Ex : 90" },
    { key: "type",        label: "Type d'énergie",          type: "select", options: ["Électricité seule","Gaz seul","Électricité + Gaz"] },
    { key: "power",       label: "Puissance souscrite",     type: "select", options: ["3 kVA","6 kVA","9 kVA","12 kVA","Je ne sais pas"] },
    { key: "consumption", label: "Consommation annuelle",   type: "select", options: ["Moins de 3 000 kWh","3 000 – 6 000 kWh","6 000 – 10 000 kWh","Plus de 10 000 kWh","Je ne sais pas"] },
    { key: "green",       label: "Offre verte souhaitée ?", type: "select", options: ["Oui","Non","Peu importe"] },
    { key: "heater",      label: "Chauffage électrique ?",  type: "select", options: ["Oui","Non"] },
  ],
  internet: [
    { key: "provider",   label: "Opérateur actuel",        type: "select", options: ["Orange","SFR","Bouygues","Free","RED by SFR","Sosh","Autre"] },
    { key: "price",      label: "Prix mensuel (€)",        type: "number", placeholder: "Ex : 39.99" },
    { key: "type",       label: "Type de connexion",       type: "select", options: ["Fibre optique (FTTH)","ADSL","VDSL","4G/5G fixe","Je ne sais pas"] },
    { key: "speed",      label: "Débit download actuel",   type: "select", options: ["Moins de 100 Mb/s","100 – 500 Mb/s","500 Mb – 1 Gb/s","Plus de 1 Gb/s","Je ne sais pas"] },
    { key: "tv",         label: "Pack TV inclus ?",        type: "select", options: ["Oui","Non"] },
    { key: "commitment", label: "Engagement",              type: "select", options: ["Sans engagement","12 mois","24 mois"] },
    { key: "phone_line", label: "Ligne fixe incluse ?",    type: "select", options: ["Oui","Non"] },
  ],
  insurance_home: [
    { key: "provider",     label: "Assureur actuel",         type: "select", options: ["AXA","Maif","Macif","Allianz","MMA","Groupama","Luko","April","Autre"] },
    { key: "price",        label: "Prix mensuel (€)",        type: "number", placeholder: "Ex : 15" },
    { key: "housing_type", label: "Type de logement",        type: "select", options: ["Appartement","Maison"] },
    { key: "status",       label: "Statut",                  type: "select", options: ["Locataire","Propriétaire"] },
    { key: "area",         label: "Surface (m²)",            type: "select", options: ["Moins de 30 m²","30 – 60 m²","60 – 100 m²","100 – 150 m²","Plus de 150 m²"] },
    { key: "rooms",        label: "Nombre de pièces",        type: "select", options: ["1","2","3","4","5 ou plus"] },
    { key: "cover",        label: "Niveau de couverture",    type: "select", options: ["Basique","Standard","Confort","Premium"] },
  ],
  insurance_auto: [
    { key: "provider",    label: "Assureur actuel",         type: "select", options: ["AXA","Maif","Macif","Direct Assurance","Leocare","Allianz","MMA","Autre"] },
    { key: "price",       label: "Prix mensuel (€)",        type: "number", placeholder: "Ex : 45" },
    { key: "cover_level", label: "Niveau de couverture",    type: "select", options: ["Tiers simple","Tiers étendu","Tous risques"] },
    { key: "vehicle_age", label: "Âge du véhicule",        type: "select", options: ["Moins de 2 ans","2 – 5 ans","5 – 10 ans","Plus de 10 ans"] },
    { key: "usage",       label: "Usage principal",         type: "select", options: ["Domicile – travail","Loisirs","Professionnel"] },
    { key: "km_year",     label: "Km / an",                 type: "select", options: ["Moins de 5 000 km","5 000 – 10 000 km","10 000 – 20 000 km","Plus de 20 000 km"] },
    { key: "bonus",       label: "Coefficient bonus/malus", type: "select", options: ["0.50 (max bonus)","0.60 – 0.70","0.80 – 0.90","1.00 (neutre)","Malus > 1"] },
  ],
};

const TESTIMONIALS = [
  { name: "Léa M.", age: 28, role: "Designer freelance", avatar: "L", color: "#00C8FF",
    saving: 576, category: "📱 Mobile",
    text: "J'avais le même forfait depuis 4 ans sans jamais regarder. En 2 minutes j'ai trouvé exactement le même service à 19€ au lieu de 67€. Mind blown 🤯" },
  { name: "Thomas D.", age: 34, role: "Dev fullstack", avatar: "T", color: "#00E5C7",
    saving: 312, category: "⚡ Énergie",
    text: "L'IA m'a sorti un comparatif sur-mesure en quelques secondes. J'ai changé de fournisseur en 5 min, économie immédiate de 26€/mois sur ma facture d'élec." },
  { name: "Inès K.", age: 31, role: "Chef de projet digital", avatar: "I", color: "#7B5BFF",
    saving: 240, category: "🌐 Internet",
    text: "Honnêtement je m'attendais à du blabla. Mais le matching avec mes besoins est super précis. J'ai gardé la fibre, économie de 20€/mois. Je recommande à fond !" },
];

const SURVEY = [
  { id: "privacy",   q: "Transmettre ta facture t'a-t-il semblé risqué pour tes données ?", opts: ["Non, je me sens en confiance", "Un peu, j'aurais besoin de garanties", "Oui, ça m'a freiné(e)"] },
  { id: "relevance", q: "Les offres proposées correspondaient-elles bien à ta situation ?",   opts: ["Oui, très bien ciblées", "Partiellement", "Non, pas assez précises"] },
  { id: "ease",     q: "Comment tu évalues la simplicité d'utilisation ?",                    opts: ["Très simple et intuitif", "Correct, mais perfectible", "Difficile à prendre en main"] },
  { id: "trust",    q: "Serais-tu prêt(e) à changer de contrat via une recommandation Économio ?", opts: ["Oui, j'ai confiance", "Peut-être avec plus d'infos", "Non, je préfère chercher seul(e)"] },
  { id: "recommend",q: "Tu recommanderais Économio à un proche ?",                            opts: ["Oui, à fond !", "Peut-être si ça s'améliore", "Non, pas dans l'état actuel"] },
];

const FAQ = [
  { q: "🔒 Est-ce que mes données personnelles sont en sécurité ?",
    a: "Oui, à 100%. Nous ne stockons aucune donnée personnelle sur nos serveurs. Tes informations sont analysées en temps réel par l'IA puis immédiatement effacées. Tu peux aussi anonymiser ta facture avant de nous l'envoyer grâce à notre outil intégré (bouton en haut à droite). Ton historique d'économies reste uniquement sur ton appareil." },
  { q: "🤖 Comment fonctionnent les recommandations de l'IA ?",
    a: "Notre IA analyse les caractéristiques de ton contrat actuel (prix, options, usage) et les compare en temps réel avec toutes les offres disponibles sur le marché français. Elle ne te propose que des offres équivalentes ou meilleures pour TES besoins — pas juste les moins chères. C'est du sur-mesure, pas du copier-coller." },
  { q: "🔄 Comment je change de contrat si une offre m'intéresse ?",
    a: "C'est ultra simple ! En cliquant sur l'offre qui te plaît, tu es redirigé(e) vers le site officiel du fournisseur. Tu souscris en ligne en quelques minutes, et la plupart des opérateurs gèrent la résiliation de ton ancien contrat automatiquement (notamment pour le mobile et internet via la portabilité). Aucune coupure de service en général." },
];

const STORAGE_KEY = "economio_savings_v1";
const LOGO = (n) => (n || "?").slice(0, 2).toUpperCase();

// ═══════════════════════════════════════════════════════════════════════════════
// SURVEY POPUP
// ═══════════════════════════════════════════════════════════════════════════════
function SurveyPopup({ onClose }) {
  const [answers, setAnswers] = useState({});
  const [idx, setIdx]         = useState(0);
  const [done, setDone]       = useState(false);

  const q = SURVEY[idx];
  const total = SURVEY.length;
  const pick = (opt) => setAnswers(a => ({ ...a, [q.id]: opt }));
  const next = () => idx < total - 1 ? setIdx(i => i + 1) : setDone(true);
  const prev = () => setIdx(i => i - 1);

  return (
    <div style={O.overlay} onClick={onClose}>
      <div style={O.modal} onClick={e => e.stopPropagation()}>
        {!done ? (
          <>
            <div style={O.mHeader}>
              <div>
                <div style={O.tag}>📋 Bêta · Questionnaire</div>
                <h2 style={O.mTitle}>Aide-nous à améliorer Économio</h2>
                <p style={O.mSub}>{total} questions · anonyme · 1 minute chrono</p>
              </div>
              <button style={O.closeBtn} onClick={onClose}>✕</button>
            </div>
            <div style={O.progressWrap}>
              <div style={O.progressTrack}>
                <div style={{ ...O.progressFill, width: `${(idx / total) * 100}%` }} />
              </div>
              <span style={O.progressLabel}>{idx + 1} / {total}</span>
            </div>
            <p style={O.qText}>{q.q}</p>
            <div style={O.optsList}>
              {q.opts.map(opt => {
                const sel = answers[q.id] === opt;
                return (
                  <button key={opt} style={{ ...O.optBtn, ...(sel ? O.optBtnSel : {}) }} onClick={() => pick(opt)}>
                    <span style={{ ...O.checkbox, ...(sel ? O.checkboxSel : {}) }}>{sel ? "✓" : ""}</span>
                    <span style={{ textAlign: "left", lineHeight: 1.4 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <div style={O.navRow}>
              {idx > 0 && <button style={O.prevBtn} onClick={prev}>← Précédent</button>}
              <button
                style={{ ...O.nextBtn, opacity: answers[q.id] ? 1 : 0.35, cursor: answers[q.id] ? "pointer" : "not-allowed", marginLeft: "auto" }}
                disabled={!answers[q.id]} onClick={next}
              >
                {idx === total - 1 ? "Envoyer ✓" : "Suivant →"}
              </button>
            </div>
          </>
        ) : (
          <div style={O.thankWrap}>
            <div style={{ fontSize: 56 }}>🙏</div>
            <h2 style={O.mTitle}>Merci pour ton retour !</h2>
            <p style={O.mSub}>Tes réponses nous aident à améliorer Économio. À très vite !</p>
            <button style={O.nextBtn} onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANONYMIZE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AnonymizeModal({ onClose }) {
  const [anonText, setAnonText] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const isImg  = file.type.startsWith("image/");
      await doAnonymize(base64, file.type || "application/pdf", isImg);
    };
    reader.readAsDataURL(file);
  };

  const doAnonymize = async (base64, mime, isImg) => {
    setLoading(true); setAnonText(null);
    try {
      const block = isImg
        ? { type: "image",    source: { type: "base64", media_type: mime, data: base64 } }
        : { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } };
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: [block,
            { type: "text", text: `Tu es expert RGPD. Retranscris ce document en remplaçant TOUTES les données personnelles :
- Nom/prénom → [NOM PRÉNOM]
- Adresse → [ADRESSE]
- Téléphone → [TÉLÉPHONE]
- Email → [EMAIL]
- N° client/contrat/abonné → [N° CLIENT]
- IBAN/RIB → [COORDONNÉES BANCAIRES]
- Date de naissance → [DATE DE NAISSANCE]
- Toute autre donnée identifiante → [DONNÉE MASQUÉE]
Conserve les montants, dates de facture, offres et détails techniques. Formate lisiblement.` }
          ]}]
        })
      });
      const data = await res.json();
      setAnonText(data.content?.map(b => b.text || "").join("") || "Impossible de lire le document.");
    } catch {
      setAnonText("❌ Erreur. Vérifie ta connexion et réessaie.");
    }
    setLoading(false);
  };

  return (
    <div style={O.overlay} onClick={onClose}>
      <div style={{ ...O.modal, maxWidth: 620, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={O.mHeader}>
          <div>
            <div style={O.tag}>🔒 Protection RGPD</div>
            <h2 style={O.mTitle}>Anonymise ta facture</h2>
            <p style={O.mSub}>L'IA masque toutes tes données personnelles avant transmission</p>
          </div>
          <button style={O.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={A.infoBand}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Données masquées automatiquement</div>
            <div style={{ fontSize: 13, color: "#94A3C7", lineHeight: 1.5 }}>
              Nom · Adresse · Téléphone · Email · N° client · IBAN — seuls les montants et détails techniques sont conservés.
            </div>
          </div>
        </div>

        {!anonText && !loading && (
          <label htmlFor="anon-file"
            style={{ ...A.dropzone, ...(dragOver ? A.dropzoneHover : {}), display: "block", cursor: "pointer" }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input id="anon-file" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize: 42, marginBottom: 12 }}>📄</div>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Glisse ta facture ici</p>
            <p style={{ fontSize: 13, color: "#6B7B9C", marginBottom: 20 }}>JPG, PNG ou PDF</p>
            <span style={A.uploadBtn}>Choisir un fichier</span>
          </label>
        )}

        {loading && (
          <div style={A.loaderWrap}>
            <div style={A.spinner} />
            <p style={{ fontWeight: 600 }}>Anonymisation en cours…</p>
            <p style={{ fontSize: 13, color: "#6B7B9C" }}>L'IA identifie et masque tes données personnelles</p>
          </div>
        )}

        {anonText && (
          <div>
            <div style={A.resultBar}>
              <span style={{ color: "#00E5C7", fontWeight: 700 }}>✓ Facture anonymisée</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={A.copyBtn} onClick={() => navigator.clipboard.writeText(anonText)}>📋 Copier</button>
                <button style={A.retryBtn} onClick={() => setAnonText(null)}>Nouvelle</button>
              </div>
            </div>
            <div style={A.resultBox}>{anonText}</div>
            <p style={{ fontSize: 12, color: "#4B5673", marginTop: 10, lineHeight: 1.5 }}>
              ✅ Aucune donnée personnelle n'est stockée. Tu peux transmettre ce texte sereinement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardModal({ onClose, savings, onClear }) {
  const total      = savings.reduce((s, x) => s + (x.savings_year || 0), 0);
  const totalMonth = Math.round(total / 12);

  return (
    <div style={O.overlay} onClick={onClose}>
      <div style={{ ...O.modal, maxWidth: 640, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={O.mHeader}>
          <div>
            <div style={O.tag}>📊 Mon tableau de bord</div>
            <h2 style={O.mTitle}>Tes économies réalisées</h2>
            <p style={O.mSub}>Suivi local — uniquement sur cet appareil</p>
          </div>
          <button style={O.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Total card */}
        <div style={D.totalCard}>
          <div style={D.totalLabel}>💰 Total des économies estimées</div>
          <div style={D.totalAmount}>{total}€<span style={D.totalUnit}>/an</span></div>
          <div style={D.totalSub}>soit {totalMonth}€/mois récupérés ! 🎉</div>
        </div>

        {savings.length === 0 ? (
          <div style={D.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🪙</div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>Pas encore d'économie enregistrée</p>
            <p style={{ fontSize: 13, color: "#6B7B9C", marginTop: 4 }}>Lance ta première analyse pour voir apparaître tes économies ici !</p>
          </div>
        ) : (
          <>
            <h3 style={D.histTitle}>Historique</h3>
            <div style={D.list}>
              {savings.slice().reverse().map((s, i) => (
                <div key={i} style={D.item}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.category}</div>
                    <div style={{ fontSize: 12, color: "#6B7B9C", marginTop: 2 }}>{s.from_provider} → {s.to_provider}</div>
                    <div style={{ fontSize: 11, color: "#4B5673", marginTop: 2 }}>{new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#00E5C7", fontWeight: 800, fontSize: 16 }}>+{s.savings_year}€</div>
                    <div style={{ fontSize: 10, color: "#6B7B9C" }}>/an</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={D.clearBtn} onClick={onClear}>🗑️ Effacer l'historique</button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function EconomioApp() {
  const [step, setStep]             = useState("home");
  const [category, setCategory]     = useState(null);
  const [formData, setFormData]     = useState({});
  const [result, setResult]         = useState(null);
  const [offers, setOffers]         = useState([]);
  const [loadStep, setLoadStep]     = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showAnon, setShowAnon]     = useState(false);
  const [showDash, setShowDash]     = useState(false);
  const [savedSavings, setSavedSavings] = useState([]);
  const [openFAQ, setOpenFAQ]       = useState(null);
  const [scrolled, setScrolled]     = useState(false);
  const [maskBeforeUpload, setMaskBeforeUpload] = useState(true);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [uploadStage, setUploadStage] = useState("");

  const cat    = category ? CATEGORY_LABELS[category] : null;
  const fields = category ? CATEGORY_FORMS[category] : [];

  // Load savings on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) setSavedSavings(JSON.parse(data));
    } catch {}
  }, []);

  // Scroll detection for header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setField = (k, v) => setFormData(f => ({ ...f, [k]: v }));
  const formValid = () => !!category && fields.filter(f => f.key === "provider" || f.key === "price").every(f => formData[f.key]);

  // ── Upload bill: extract data with AI and pre-fill form ───────────────────
  const handleBillUpload = async (file) => {
    if (!file) return;
    setUploadProcessing(true);
    setUploadStage(maskBeforeUpload ? "🔒 Masquage de tes données personnelles..." : "📖 Lecture de la facture...");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const isImg = file.type.startsWith("image/");
        const block = isImg
          ? { type: "image", source: { type: "base64", media_type: file.type, data: base64 } }
          : { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } };

        // Build extraction prompt with category-specific fields
        const fieldsList = fields.map(f =>
          f.type === "select" ? `- ${f.key} (choisir parmi : ${f.options.join(", ")})` : `- ${f.key} (montant en €)`
        ).join("\n");

        const maskInstruction = maskBeforeUpload
          ? "IMPORTANT : ignore et ne traite AUCUNE donnée personnelle (nom, adresse, IBAN, n° client, téléphone, email). Concentre-toi uniquement sur les détails du contrat."
          : "";

        setUploadStage("🤖 L'IA analyse ta facture...");

        const res = await fetch("/api/claude", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 1000,
            messages: [{ role: "user", content: [block, {
              type: "text",
              text: `${maskInstruction}

Tu es expert en lecture de factures françaises. Extrais les informations de cette facture "${cat.label}" pour pré-remplir un formulaire.

Champs à extraire (utilise EXACTEMENT les valeurs proposées pour les selects) :
${fieldsList}

Réponds UNIQUEMENT en JSON strict, sans markdown, sans backticks, avec les clés correspondantes. Exemple :
{ "provider": "Free Mobile", "price": 19.99, "data": "300 Go ou +", ... }

Si tu ne trouves pas une info, mets null.`
            }]}]
          }),
        });

        const data = await res.json();
        const text = data.content?.map(b => b.text || "").join("") || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

        // Pre-fill form with extracted values
        setUploadStage("✓ Formulaire pré-rempli !");
        const cleaned = {};
        Object.keys(parsed).forEach(k => {
          if (parsed[k] !== null && parsed[k] !== undefined && parsed[k] !== "") {
            cleaned[k] = parsed[k];
          }
        });
        setFormData(f => ({ ...f, ...cleaned }));

        setTimeout(() => setUploadProcessing(false), 800);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadStage("❌ Erreur lors de la lecture");
      setTimeout(() => setUploadProcessing(false), 1500);
    }
  };

  const saveSaving = (offer, currentResult) => {
    if (!offer.savings_year || offer.savings_year <= 0) return;
    const entry = {
      date: new Date().toISOString(),
      category: cat.label,
      icon: cat.icon,
      from_provider: currentResult.provider,
      to_provider: offer.provider,
      savings_year: offer.savings_year,
    };
    const updated = [...savedSavings, entry];
    setSavedSavings(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  const clearSavings = () => {
    setSavedSavings([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const analyze = async () => {
    setStep("analyzing"); setLoadStep(0);
    const t1 = setTimeout(() => setLoadStep(1), 1200);
    const t2 = setTimeout(() => setLoadStep(2), 2600);
    const summary = fields.map(f => `${f.label}: ${formData[f.key] || "non renseigné"}`).join("\n");
    const prompt = `Tu es expert en comparaison d'offres françaises. L'utilisateur a un contrat "${cat.label}" :
${summary}

Propose 4 offres concurrentes RÉELLES en France 2025 adaptées à ses besoins.
Réponds UNIQUEMENT en JSON strict, sans markdown, sans backticks :
{
  "current": { "provider":"...","amount":<n>,"contract":"...","details":"résumé 1 ligne","assessment":"appréciation honnête (bon/moyen/mauvais rapport qualité-prix)" },
  "offers": [{ "provider":"...","name":"...","price":<n>,"highlight":"avantage principal","match":"pourquoi ça correspond","savings_year":<économie €>,"url":"https://..." }]
}`;
    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      clearTimeout(t1); clearTimeout(t2);
      setResult(parsed.current); setOffers(parsed.offers || []);
    } catch {
      clearTimeout(t1); clearTimeout(t2);
      setResult({ provider: formData.provider || "Ton opérateur", amount: parseFloat(formData.price) || 0, contract: "Contrat actuel", details: "", assessment: "Analyse temporairement indisponible." });
      setOffers([]);
    }
    setStep("results");
    setTimeout(() => setShowSurvey(true), 3000);
  };

  const reset = () => {
    setStep("home"); setCategory(null); setFormData({});
    setResult(null); setOffers([]); setLoadStep(0); setShowSurvey(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={S.root}>
      <div style={S.bgMesh} />
      <div style={S.bgGrid} />

      {/* Modals */}
      {showSurvey && <SurveyPopup onClose={() => setShowSurvey(false)} />}
      {showAnon   && <AnonymizeModal onClose={() => setShowAnon(false)} />}
      {showDash   && <DashboardModal onClose={() => setShowDash(false)} savings={savedSavings} onClear={clearSavings} />}

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Économio ! J'ai une question 👋")}`}
        target="_blank" rel="noopener noreferrer"
        style={S.whatsapp} aria-label="Contact WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* Header */}
      <header style={{ ...S.header, ...(scrolled ? S.headerScrolled : {}) }}>
        <div style={S.headerInner}>
          <div style={S.logo} onClick={reset}>
            <div style={S.logoMark}>⚡</div>
            <span style={S.logoTxt}>Économio</span>
          </div>
          <nav style={S.nav}>
            <button style={S.navBtn} onClick={() => setShowDash(true)}>
              📊 <span style={S.navLabel}>Mon dashboard</span>
              {savedSavings.length > 0 && <span style={S.navDot}>{savedSavings.length}</span>}
            </button>
            <button style={S.anonBtn} onClick={() => setShowAnon(true)}>
              🔒 <span style={S.navLabel}>Anonymiser</span>
            </button>
            {step !== "home" && <button style={S.backBtn} onClick={reset}>← Recommencer</button>}
          </nav>
        </div>
      </header>

      <main style={S.main}>

        {/* ═══ HOME ═══ */}
        {step === "home" && (
          <>
            {/* HERO */}
            <section style={S.hero}>
              <div style={S.heroBadge}>
                <span style={S.pulseDot}></span> 🤖 Propulsé par l'IA
              </div>
              <h1 style={S.heroTitle}>
                <span>Économise jusqu'à</span>
                <span style={S.heroAmount}>576€</span>
                <span>par an sur tes factures</span>
              </h1>
              <p style={S.heroSub}>
                Décris ton contrat actuel, l'IA scanne le marché en 2 minutes et te dégote les meilleures offres adaptées à tes besoins.<br />
                <strong style={{ color: "#00E5C7" }}>Aucune carte bancaire. Aucun blabla.</strong>
              </p>
              <button style={S.ctaPrimary} onClick={scrollToCategories}>
                🚀 Lance ton analyse gratuite
              </button>
              <div style={S.heroProof}>
                <div style={S.avatars}>
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} style={{ ...S.avatarMini, background: t.color, marginLeft: i > 0 ? -10 : 0, zIndex: 3-i }}>{t.avatar}</div>
                  ))}
                </div>
                <span style={S.heroProofText}>+1 200 personnes ont déjà économisé ✨</span>
              </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" style={S.section}>
              <div style={S.sectionHeader}>
                <div style={S.sectionTag}>Étape 1</div>
                <h2 style={S.sectionTitle}>Choisis ta catégorie</h2>
                <p style={S.sectionSub}>5 types de factures supportés. Plus à venir.</p>
              </div>
              <div style={S.catGrid}>
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <button key={key} style={S.catCard}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = val.color; e.currentTarget.style.background = "rgba(0,200,255,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    onClick={() => { setCategory(key); setStep("form"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <span style={{ ...S.catIconBox, background: `${val.color}22`, color: val.color }}>{val.icon}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{val.label}</span>
                    <span style={{ opacity: 0.4, fontSize: 18 }}>→</span>
                  </button>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={S.section}>
              <div style={S.sectionHeader}>
                <div style={S.sectionTag}>Comment ça marche</div>
                <h2 style={S.sectionTitle}>3 étapes, 2 minutes ⚡</h2>
              </div>
              <div style={S.stepsGrid}>
                {[
                  { n: "01", title: "Décris ton contrat", desc: "Renseigne ton fournisseur, ton prix mensuel et quelques infos clés. Aucun document n'est stocké.", icon: "✍️" },
                  { n: "02", title: "L'IA analyse", desc: "Notre IA compare en temps réel ton contrat avec toutes les offres disponibles sur le marché français.", icon: "🤖" },
                  { n: "03", title: "Tu choisis et économises", desc: "Choisis l'offre qui te plaît, on te redirige vers le fournisseur. Le changement se fait en quelques minutes.", icon: "💰" },
                ].map((s, i) => (
                  <div key={i} style={S.stepCard}>
                    <div style={S.stepNum}>{s.n}</div>
                    <div style={S.stepIcon}>{s.icon}</div>
                    <h3 style={S.stepTitle}>{s.title}</h3>
                    <p style={S.stepDesc}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={S.section}>
              <div style={S.sectionHeader}>
                <div style={S.sectionTag}>⭐ Témoignages</div>
                <h2 style={S.sectionTitle}>Ils ont économisé avec Économio</h2>
                <p style={S.sectionSub}>Des vrais retours de jeunes actifs qui ont sauté le pas.</p>
              </div>
              <div style={S.testimGrid}>
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} style={S.testimCard}>
                    <div style={S.testimHeader}>
                      <div style={{ ...S.testimAvatar, background: t.color }}>{t.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}, {t.age} ans</div>
                        <div style={{ fontSize: 12, color: "#6B7B9C" }}>{t.role}</div>
                      </div>
                    </div>
                    <div style={S.testimSavingBar}>
                      <span>{t.category}</span>
                      <strong style={{ color: "#00E5C7" }}>+{t.saving}€/an</strong>
                    </div>
                    <p style={S.testimText}>"{t.text}"</p>
                    <div style={S.testimStars}>⭐⭐⭐⭐⭐</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section style={S.section}>
              <div style={S.sectionHeader}>
                <div style={S.sectionTag}>FAQ</div>
                <h2 style={S.sectionTitle}>Tout ce que tu dois savoir</h2>
              </div>
              <div style={S.faqList}>
                {FAQ.map((item, i) => (
                  <div key={i} style={{ ...S.faqItem, ...(openFAQ === i ? S.faqItemOpen : {}) }}>
                    <button style={S.faqQuestion} onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                      <span>{item.q}</span>
                      <span style={{ fontSize: 22, color: "#00C8FF", transform: openFAQ === i ? "rotate(45deg)" : "none", transition: "transform .3s" }}>+</span>
                    </button>
                    {openFAQ === i && <div style={S.faqAnswer}>{item.a}</div>}
                  </div>
                ))}
              </div>
            </section>

            {/* FINAL CTA */}
            <section style={S.finalCTA}>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>
                Prêt à économiser ?
              </h2>
              <p style={{ fontSize: 17, color: "#94A3C7", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
                Lance ton analyse gratuite, découvre ce que tu peux économiser en 2 minutes.
              </p>
              <button style={S.ctaPrimary} onClick={scrollToCategories}>⚡ C'est parti — gratuit</button>
            </section>

            {/* FOOTER */}
            <footer style={S.footer}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={S.logoMark}>⚡</div>
                <span style={{ fontWeight: 700 }}>Économio</span>
              </div>
              <p style={{ fontSize: 12, color: "#4B5673", marginTop: 12, lineHeight: 1.6 }}>
                © 2025 Économio · Service indépendant · Aucun lien commercial avec les fournisseurs cités<br />
                Économio perçoit une commission d'affiliation sur les souscriptions, sans impact sur les prix.
              </p>
            </footer>
          </>
        )}

        {/* ═══ FORM ═══ */}
        {step === "form" && cat && (
          <div style={S.formWrap}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ ...S.catIconBox, background: `${cat.color}22`, color: cat.color, width: 64, height: 64, fontSize: 32, display: "inline-flex" }}>{cat.icon}</span>
              <h2 style={S.formTitle}>{cat.label}</h2>
              <p style={{ color: "#94A3C7", fontSize: 15, margin: 0 }}>Renseigne ton contrat actuel pour une comparaison ultra-précise</p>
            </div>

            {/* Upload express */}
            <div style={S.uploadCard}>
              <div style={S.uploadCardHeader}>
                <div>
                  <div style={S.uploadCardTag}>⚡ Upload express</div>
                  <h3 style={S.uploadCardTitle}>Gagne du temps : envoie ta facture</h3>
                  <p style={S.uploadCardSub}>L'IA lit ta facture et pré-remplit le formulaire en 5 secondes.</p>
                </div>
                <div style={S.uploadCardIcon}>📄</div>
              </div>

              <div style={S.privacyChoice}>
                <label style={{ ...S.privacyOption, ...(maskBeforeUpload ? S.privacyOptionActive : {}) }}>
                  <input type="radio" name="mask" checked={maskBeforeUpload} onChange={() => setMaskBeforeUpload(true)} style={{ display: "none" }} />
                  <span style={{ ...S.radioCircle, ...(maskBeforeUpload ? S.radioCircleActive : {}) }}>{maskBeforeUpload && "✓"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>🔒 Masquer mes infos persos (recommandé)</div>
                    <div style={{ fontSize: 12, color: "#94A3C7", marginTop: 2 }}>Nom, adresse, IBAN... seront automatiquement supprimés</div>
                  </div>
                </label>
                <label style={{ ...S.privacyOption, ...(!maskBeforeUpload ? S.privacyOptionActive : {}) }}>
                  <input type="radio" name="mask" checked={!maskBeforeUpload} onChange={() => setMaskBeforeUpload(false)} style={{ display: "none" }} />
                  <span style={{ ...S.radioCircle, ...(!maskBeforeUpload ? S.radioCircleActive : {}) }}>{!maskBeforeUpload && "✓"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>📤 Envoyer telle quelle</div>
                    <div style={{ fontSize: 12, color: "#94A3C7", marginTop: 2 }}>Plus rapide, mais inclut toutes les données</div>
                  </div>
                </label>
              </div>

              {!uploadProcessing ? (
                <label htmlFor="form-upload" style={{ ...S.uploadBtnLarge, cursor: "pointer", display: "block", textAlign: "center" }}>
                  <input id="form-upload" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => handleBillUpload(e.target.files[0])} />
                  📎 Choisir une facture (PDF ou photo)
                </label>
              ) : (
                <div style={S.uploadProcessing}>
                  <div style={A.spinner} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{uploadStage}</div>
                    <div style={{ fontSize: 12, color: "#94A3C7", marginTop: 2 }}>Quelques secondes...</div>
                  </div>
                </div>
              )}
            </div>

            <div style={S.orDivider}><span>OU REMPLIS MANUELLEMENT</span></div>

            <div style={S.fieldsGrid}>
              {fields.map(f => (
                <div key={f.key} style={S.fieldGroup}>
                  <label style={S.fieldLabel}>{f.label}</label>
                  {f.type === "select" ? (
                    <select style={S.select} value={formData[f.key] || ""} onChange={e => setField(f.key, e.target.value)}>
                      <option value="">-- Choisir --</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <input type="number" style={S.input} placeholder={f.placeholder} value={formData[f.key] || ""} onChange={e => setField(f.key, e.target.value)} />
                      <span style={S.suffix}>€/mois</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button style={{ ...S.analyzeBtn, background: formValid() ? `linear-gradient(135deg, ${cat.color}, #00E5C7)` : "#1A1F35", opacity: formValid() ? 1 : 0.55, cursor: formValid() ? "pointer" : "not-allowed" }} disabled={!formValid()} onClick={analyze}>
              🔍 Analyser et comparer →
            </button>
            {!formValid() && <p style={{ textAlign: "center", color: "#4B5673", fontSize: 13, marginTop: 8 }}>Renseigne au minimum l'opérateur et le prix mensuel</p>}
          </div>
        )}

        {/* ═══ ANALYZING ═══ */}
        {step === "analyzing" && (
          <div style={S.analyzingWrap}>
            <div style={S.spinnerRing} />
            <div style={{ fontSize: 56, position: "relative", zIndex: 1 }}>🤖</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Analyse en cours…</h2>
            <p style={{ color: "#94A3C7", maxWidth: 380, textAlign: "center", lineHeight: 1.6 }}>L'IA compare ton contrat avec toutes les offres du marché</p>
            <div style={S.progressBar}><div style={S.progressFill} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              {["✓ Contrat reçu","⟳ Analyse de tes besoins","○ Recherche des meilleures offres"].map((s, i) => (
                <span key={i} style={{ color: i < loadStep ? "#00E5C7" : i === loadStep ? "#00C8FF" : "#374151" }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {step === "results" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeUp .5s ease" }}>

            <div style={S.currentCard}>
              <span style={S.currentBadge}>📋 Ton contrat actuel</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{result.provider}</div>
                  <div style={{ fontSize: 14, color: "#94A3C7", margin: "4px 0" }}>{result.contract}</div>
                  <div style={{ fontSize: 13, color: "#6B7B9C" }}>{result.details}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#FF5670", lineHeight: 1 }}>{result.amount}€</div>
                  <div style={{ fontSize: 12, color: "#6B7B9C" }}>/mois</div>
                </div>
              </div>
              {result.assessment && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, fontSize: 13, color: "#94A3C7", lineHeight: 1.5 }}>
                  💡 {result.assessment}
                </div>
              )}
            </div>

            {offers.length > 0 && Math.max(...offers.map(o => o.savings_year || 0)) > 0 && (
              <div style={S.savingsBanner}>
                🎉 Tu peux économiser jusqu'à <strong style={{ color: "#FFFFFF", fontSize: 22 }}>{Math.max(...offers.map(o => o.savings_year || 0))}€ / an</strong>
              </div>
            )}

            {offers.length > 0 && (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Top offres pour toi</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {offers.map((offer, i) => (
                    <div key={i} style={{ ...S.offerCard, ...(i === 0 ? S.offerCardBest : {}) }}>
                      {i === 0 && <div style={S.bestBadge}>⭐ Top choix</div>}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                        <div style={S.offerLogo}>{LOGO(offer.provider)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{offer.provider}</div>
                          <div style={{ fontSize: 13, color: "#94A3C7" }}>{offer.name}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 28, fontWeight: 900, color: "#00E5C7", lineHeight: 1 }}>{offer.price}€</div>
                          <div style={{ fontSize: 11, color: "#6B7B9C" }}>/mois</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#94A3C7", marginBottom: 4 }}>✓ {offer.highlight}</div>
                      {offer.match && <div style={{ fontSize: 12, color: "#6B7B9C", marginBottom: 10 }}>🎯 {offer.match}</div>}
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: offer.savings_year > 0 ? "#00E5C7" : offer.savings_year < 0 ? "#FF5670" : "#94A3C7" }}>
                        {offer.savings_year > 0 ? `💰 Économie : ${offer.savings_year}€/an` : offer.savings_year < 0 ? `⚠️ Plus cher de ${Math.abs(offer.savings_year)}€/an` : "➡️ Prix équivalent"}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={getAffiliateUrl(offer.provider, offer.url)} target="_blank" rel="noopener noreferrer"
                          style={{ ...S.offerCTA, ...(i === 0 ? { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", border: "none", color: "#0A0E1A" } : {}) }}>
                          Voir l'offre →
                        </a>
                        {offer.savings_year > 0 && (
                          <button style={S.saveBtn} onClick={() => { saveSaving(offer, result); alert(`✓ ${offer.savings_year}€ ajoutés à ton dashboard !`); }}>
                            💾 Tracker
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={S.feedbackBar}>
              <span style={{ fontSize: 15 }}>💬 Donne-nous ton avis</span>
              <button style={S.feedbackBtn} onClick={() => setShowSurvey(true)}>Répondre →</button>
            </div>

            <p style={{ fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6 }}>
              🔒 Données non stockées · Offres indicatives — vérifie sur chaque site · Économio perçoit une commission d'affiliation, sans impact sur les prix.
            </p>
            <button style={S.resetBtn} onClick={reset}>Analyser une autre facture</button>
          </div>
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES — BLUE/CYAN PALETTE, START-UP DYNAMIC FEEL
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  root:        { minHeight: "100vh", background: "#050810", color: "#E8F1FF", position: "relative", overflowX: "hidden" },
  bgMesh:      { position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 50% at 20% 0%,rgba(0,200,255,0.15) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 100%,rgba(0,229,199,0.12) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 50% 50%,rgba(123,91,255,0.06) 0%,transparent 70%)", pointerEvents: "none" },
  bgGrid:      { position: "fixed", inset: 0, zIndex: 0, opacity: 0.4, backgroundImage: "linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" },
  header:      { position: "sticky", top: 0, zIndex: 50, background: "rgba(5,8,16,0.6)", backdropFilter: "blur(12px)", transition: "all .3s", borderBottom: "1px solid transparent" },
  headerScrolled: { background: "rgba(5,8,16,0.92)", borderBottom: "1px solid rgba(0,200,255,0.12)" },
  headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" },
  logo:        { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoMark:    { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#00C8FF,#00E5C7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 16px rgba(0,200,255,0.4)" },
  logoTxt:     { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#00C8FF,#00E5C7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  nav:         { display: "flex", alignItems: "center", gap: 8 },
  navBtn:      { background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)", color: "#7BE5FF", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, position: "relative", display: "flex", alignItems: "center", gap: 6 },
  anonBtn:     { background: "rgba(0,229,199,0.08)", border: "1px solid rgba(0,229,199,0.2)", color: "#7BFFE5", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  backBtn:     { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3C7", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13 },
  navLabel:    { display: "inline-block" },
  navDot:      { background: "#FF5670", color: "white", fontSize: 11, fontWeight: 800, borderRadius: 100, padding: "1px 7px", marginLeft: 4 },
  main:        { position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" },

  // Hero
  hero:        { textAlign: "center", padding: "60px 0 40px", animation: "fadeUp .8s ease" },
  heroBadge:   { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", color: "#7BE5FF", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 },
  pulseDot:    { width: 8, height: 8, borderRadius: "50%", background: "#00E5C7", animation: "pulse 2s infinite" },
  heroTitle:   { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: "clamp(38px,7vw,72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-2.5px", margin: "0 0 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heroAmount:  { background: "linear-gradient(135deg,#00C8FF 0%,#00E5C7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "clamp(72px,12vw,140px)", lineHeight: 0.9, letterSpacing: "-4px" },
  heroSub:     { fontSize: 17, color: "#94A3C7", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 },
  ctaPrimary:  { background: "linear-gradient(135deg,#00C8FF 0%,#00E5C7 100%)", color: "#050810", border: "none", borderRadius: 14, padding: "16px 32px", fontSize: 17, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.3px", boxShadow: "0 8px 32px rgba(0,200,255,0.4)", transition: "transform .2s" },
  heroProof:   { marginTop: 32, display: "inline-flex", alignItems: "center", gap: 12 },
  avatars:     { display: "flex" },
  avatarMini:  { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white", border: "2px solid #050810" },
  heroProofText: { fontSize: 13, color: "#94A3C7" },

  // Section
  section:     { padding: "60px 0", animation: "fadeUp .8s ease" },
  sectionHeader: { textAlign: "center", marginBottom: 36, maxWidth: 540, margin: "0 auto 36px" },
  sectionTag:  { display: "inline-block", fontSize: 12, fontWeight: 700, color: "#00C8FF", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 },
  sectionTitle: { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, letterSpacing: "-1.2px", margin: "0 0 10px" },
  sectionSub:  { fontSize: 16, color: "#94A3C7", lineHeight: 1.6 },

  // Categories
  catGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 },
  catCard:     { display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", cursor: "pointer", color: "#E8F1FF", textAlign: "left", transition: "all .25s", fontSize: 15 },
  catIconBox:  { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },

  // Steps
  stepsGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 },
  stepCard:    { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", position: "relative", overflow: "hidden" },
  stepNum:     { fontFamily: "'Cabinet Grotesk',sans-serif", position: "absolute", top: 12, right: 16, fontSize: 64, fontWeight: 900, color: "rgba(0,200,255,0.06)", lineHeight: 1 },
  stepIcon:    { fontSize: 32, marginBottom: 14 },
  stepTitle:   { fontSize: 18, fontWeight: 700, marginBottom: 8 },
  stepDesc:    { fontSize: 14, color: "#94A3C7", lineHeight: 1.6 },

  // Testimonials
  testimGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 },
  testimCard:  { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px", display: "flex", flexDirection: "column", gap: 14 },
  testimHeader:{ display: "flex", alignItems: "center", gap: 12 },
  testimAvatar:{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white" },
  testimSavingBar: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,229,199,0.08)", border: "1px solid rgba(0,229,199,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13 },
  testimText:  { fontSize: 14, color: "#C5D2EC", lineHeight: 1.6, fontStyle: "italic" },
  testimStars: { fontSize: 14 },

  // FAQ
  faqList:     { display: "flex", flexDirection: "column", gap: 10, maxWidth: 720, margin: "0 auto" },
  faqItem:     { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, transition: "all .3s", overflow: "hidden" },
  faqItemOpen: { background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)" },
  faqQuestion: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 22px", background: "transparent", border: "none", color: "#E8F1FF", fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left" },
  faqAnswer:   { padding: "0 22px 22px", fontSize: 14, color: "#94A3C7", lineHeight: 1.7 },

  // Final CTA
  finalCTA:    { textAlign: "center", padding: "80px 20px", background: "linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,229,199,0.08))", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 24, margin: "60px 0 40px" },

  // Footer
  footer:      { textAlign: "center", padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 40 },

  // Form
  formWrap:    { maxWidth: 620, margin: "0 auto", padding: "32px 0", animation: "fadeUp .5s ease" },
  formTitle:   { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 30, fontWeight: 900, margin: "12px 0 6px", letterSpacing: "-0.8px" },

  // Upload express
  uploadCard:  { background: "linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,229,199,0.05))", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 16, padding: "20px", marginBottom: 24 },
  uploadCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 },
  uploadCardTag: { display: "inline-block", fontSize: 11, fontWeight: 700, color: "#00C8FF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
  uploadCardTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 4px" },
  uploadCardSub: { fontSize: 13, color: "#94A3C7", margin: 0 },
  uploadCardIcon: { fontSize: 32, opacity: 0.8, animation: "float 3s ease-in-out infinite" },
  privacyChoice: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  privacyOption: { display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all .2s" },
  privacyOptionActive: { background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.4)" },
  radioCircle: { width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, marginTop: 1 },
  radioCircleActive: { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", border: "none", color: "#050810" },
  uploadBtnLarge: { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", color: "#050810", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 14, transition: "transform .2s", border: "none" },
  uploadProcessing: { display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 12, padding: "14px 16px" },
  orDivider:   { textAlign: "center", margin: "16px 0", fontSize: 11, fontWeight: 700, color: "#4B5673", letterSpacing: 2 },

  fieldsGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 },
  fieldGroup:  { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel:  { fontSize: 12, fontWeight: 600, color: "#94A3C7", textTransform: "uppercase", letterSpacing: 0.5 },
  select:      { background: "#0F1426", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#E8F1FF", fontSize: 14, outline: "none", cursor: "pointer" },
  input:       { width: "100%", background: "#0F1426", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 60px 12px 14px", color: "#E8F1FF", fontSize: 14, outline: "none", boxSizing: "border-box" },
  suffix:      { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#6B7B9C", pointerEvents: "none" },
  analyzeBtn:  { width: "100%", color: "#050810", border: "none", borderRadius: 14, padding: "17px", fontSize: 16, fontWeight: 800, marginTop: 8, transition: "transform .2s" },

  // Analyzing
  analyzingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center", position: "relative", padding: "40px 0" },
  spinnerRing: { position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "2px solid rgba(0,200,255,0.2)", borderTopColor: "#00C8FF", animation: "spin 1.2s linear infinite" },
  progressBar: { width: 280, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" },
  progressFill: { height: "100%", width: "65%", background: "linear-gradient(90deg,#00C8FF,#00E5C7)", borderRadius: 100, animation: "progress 1.8s ease-in-out infinite" },

  // Results
  currentCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "24px" },
  currentBadge: { fontSize: 11, fontWeight: 700, color: "#94A3C7", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 14 },
  savingsBanner: { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", color: "#050810", borderRadius: 14, padding: "18px 22px", fontSize: 16, textAlign: "center", fontWeight: 700, boxShadow: "0 8px 32px rgba(0,200,255,0.3)" },
  offerCard:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px", position: "relative" },
  offerCardBest: { background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.3)" },
  bestBadge:   { position: "absolute", top: -12, left: 20, background: "linear-gradient(135deg,#00C8FF,#00E5C7)", color: "#050810", borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 800 },
  offerLogo:   { width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 },
  offerCTA:    { flex: 1, display: "block", textAlign: "center", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#E8F1FF", borderRadius: 10, padding: "12px", textDecoration: "none", fontSize: 14, fontWeight: 700 },
  saveBtn:     { background: "rgba(0,229,199,0.1)", border: "1px solid rgba(0,229,199,0.3)", color: "#00E5C7", borderRadius: 10, padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
  feedbackBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,200,255,0.06)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 14, padding: "14px 18px", flexWrap: "wrap", gap: 10 },
  feedbackBtn: { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", border: "none", color: "#050810", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 800 },
  resetBtn:    { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E8F1FF", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" },

  // WhatsApp
  whatsapp:    { position: "fixed", bottom: 24, right: 24, zIndex: 100, width: 56, height: 56, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(37,211,102,0.4)", textDecoration: "none", animation: "float 3s ease-in-out infinite" },
};

// Modal styles
const O = {
  overlay:     { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeUp .25s ease" },
  modal:       { background: "#0A1024", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 540, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" },
  mHeader:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 },
  tag:         { fontSize: 12, fontWeight: 700, color: "#00C8FF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  mTitle:      { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.4px" },
  mSub:        { fontSize: 14, color: "#6B7B9C", margin: 0 },
  closeBtn:    { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3C7", borderRadius: 8, width: 32, height: 32, cursor: "pointer", flexShrink: 0 },
  progressWrap:{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  progressTrack:{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" },
  progressFill:{ height: "100%", background: "linear-gradient(90deg,#00C8FF,#00E5C7)", borderRadius: 100, transition: "width .4s ease" },
  progressLabel:{ fontSize: 13, color: "#6B7B9C", whiteSpace: "nowrap" },
  qText:       { fontSize: 16, fontWeight: 600, lineHeight: 1.5, marginBottom: 20 },
  optsList:    { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  optBtn:      { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", color: "#E8F1FF", fontSize: 14, transition: "all .15s" },
  optBtnSel:   { background: "rgba(0,200,255,0.12)", border: "1px solid rgba(0,200,255,0.4)" },
  checkbox:    { width: 22, height: 22, borderRadius: 6, border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, color: "transparent" },
  checkboxSel: { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", border: "none", color: "#050810" },
  navRow:      { display: "flex", alignItems: "center", gap: 10 },
  prevBtn:     { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3C7", borderRadius: 10, padding: "12px 18px", cursor: "pointer", fontSize: 14 },
  nextBtn:     { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", border: "none", color: "#050810", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 800 },
  thankWrap:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center", padding: "20px 0" },
};

const A = {
  infoBand:    { display: "flex", gap: 14, alignItems: "flex-start", background: "rgba(0,229,199,0.07)", border: "1px solid rgba(0,229,199,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 },
  dropzone:    { border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 16, padding: "40px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", transition: "all .2s" },
  dropzoneHover: { borderColor: "#00C8FF", background: "rgba(0,200,255,0.08)" },
  uploadBtn:   { display: "inline-block", background: "linear-gradient(135deg,#00C8FF,#00E5C7)", color: "#050810", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer" },
  loaderWrap:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "36px 0", textAlign: "center" },
  spinner:     { width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(0,200,255,0.2)", borderTopColor: "#00C8FF", animation: "spin 1s linear infinite" },
  resultBar:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  copyBtn:     { background: "rgba(0,229,199,0.15)", border: "1px solid rgba(0,229,199,0.3)", color: "#00E5C7", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13 },
  retryBtn:    { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3C7", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13 },
  resultBox:   { background: "#050810", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", fontSize: 13, lineHeight: 1.8, color: "#C5D2EC", whiteSpace: "pre-wrap", maxHeight: 320, overflowY: "auto" },
};

const D = {
  totalCard:   { background: "linear-gradient(135deg,#00C8FF,#00E5C7)", color: "#050810", borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 24 },
  totalLabel:  { fontSize: 13, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  totalAmount: { fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px" },
  totalUnit:   { fontSize: 22, fontWeight: 700, marginLeft: 4 },
  totalSub:    { fontSize: 14, opacity: 0.8, marginTop: 8, fontWeight: 600 },
  empty:       { textAlign: "center", padding: "32px 16px" },
  histTitle:   { fontSize: 14, fontWeight: 700, color: "#94A3C7", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 },
  list:        { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  item:        { display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" },
  clearBtn:    { width: "100%", background: "rgba(255,86,112,0.08)", border: "1px solid rgba(255,86,112,0.2)", color: "#FF8FA0", borderRadius: 10, padding: "12px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
};
