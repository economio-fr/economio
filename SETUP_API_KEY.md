# 🔐 Configurer ta clé API Anthropic sur Vercel

## Étape par étape

### 1. Va sur ton projet Vercel
- https://vercel.com/dashboard
- Clique sur ton projet **economio**

### 2. Va dans les paramètres
- En haut, clique sur **"Settings"** (Paramètres)

### 3. Trouve "Environment Variables"
- Dans le menu de gauche, clique sur **"Environment Variables"**

### 4. Ajoute ta clé
- **Key (clé)** : tape exactement `ANTHROPIC_API_KEY`
- **Value (valeur)** : colle ta clé `sk-ant-api03-...`
- **Environments** : laisse coché **Production**, **Preview**, **Development**
- Clique **"Save"** (Sauvegarder)

### 5. Redéploie ton site
- Va dans l'onglet **"Deployments"** (en haut)
- Sur le dernier déploiement, clique sur les **trois petits points** `⋯`
- Clique **"Redeploy"** → confirme avec **"Redeploy"**
- Attends 1-2 minutes ☕

### 6. Teste !
- Ouvre ton site
- Fais une analyse
- L'IA fonctionne maintenant ! 🎉

---

## 🚨 Sécurité

⚠️ Ta clé API est secrète comme un mot de passe :
- ✅ Stockée en sécurité dans Vercel (variable d'environnement)
- ✅ Jamais visible dans le code public
- ❌ Ne la partage JAMAIS publiquement
- ❌ Ne la commite JAMAIS sur GitHub
