# ⚡ Économio

L'IA qui analyse tes factures et te fait économiser jusqu'à 576€/an.

## 🎨 Caractéristiques

- 🌙 Design sombre, palette bleu électrique + cyan
- 🤖 Analyse IA via Claude (Anthropic)
- 💰 Comparaison des offres mobile, énergie, internet, assurances
- 🔒 Anonymisation IA des factures (RGPD)
- 📊 Tableau de bord local "Mes économies"
- 💬 Chat WhatsApp intégré
- ⭐ Témoignages clients
- ❓ Section FAQ
- 📋 Questionnaire bêta intégré

## 🚀 Mise en ligne (Vercel)

### Étape 1 — GitHub
1. Crée un compte sur https://github.com
2. Clique sur **New repository**
3. Nomme-le `economio` → coche "Add a README" → **Create**
4. Clique sur **Add file → Upload files**
5. Glisse-dépose tous les fichiers de ce dossier (sauf le zip lui-même)
6. **Commit changes**

### Étape 2 — Vercel
1. Va sur https://vercel.com
2. Clique **Continue with GitHub**
3. Clique **Add New → Project**
4. Sélectionne ton repo `economio` → **Import**
5. Laisse les paramètres par défaut → **Deploy**
6. Attends 1-2 minutes ☕

🎉 Ton site est en ligne sur `economio-xxx.vercel.app`

## ⚙️ Configuration WhatsApp

Dans `src/App.jsx` ligne 9, remplace le numéro :
```js
const WHATSAPP_NUMBER = "33600000000"; // Mets TON numéro ici (sans +)
```

## 📁 Structure

```
economio/
├── package.json       # Dépendances
├── public/
│   └── index.html     # Page HTML de base
└── src/
    ├── index.js       # Point d'entrée React
    └── App.jsx        # Code de l'application
```

---

Made with ⚡ by Économio
