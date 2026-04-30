# 💰 Guide pour toucher tes commissions d'affiliation

## 🎯 Pourquoi c'est important

Aujourd'hui, ton site Économio génère des liens "https://www.bouyguestelecom.fr" basiques.
**Tu ne touches RIEN** dessus.

Pour gagner ta commission (entre 20€ et 150€ par souscription), il faut :
1. Rejoindre des plateformes d'affiliation (gratuit)
2. Récupérer tes liens trackés
3. Les coller dans `src/App.jsx` (section `AFFILIATE_LINKS`)

---

## 🔗 Les 4 plateformes à rejoindre (par ordre de priorité)

### 1. Awin (la plus complète) ⭐⭐⭐
👉 https://www.awin.com/fr/devenir-affilie

**Marques disponibles :**
- 📱 Bouygues Telecom, SFR, RED by SFR
- 🌐 SFR Box, Bouygues Box
- ⚡ Engie, TotalEnergies
- 🏠🚗 Direct Assurance, AXA, Allianz

💸 **Commission moyenne : 30-80€ par souscription**
📋 **Frais d'inscription : 5€ remboursés** au 1er paiement

### 2. Effiliation (français) ⭐⭐⭐
👉 https://www.effiliation.com

**Marques disponibles :**
- 📱 Free Mobile, Sosh
- 🌐 Free, Orange
- ⚡ EDF, Vattenfall
- 🏠🚗 Maif, Macif, Luko, April

💸 **Commission moyenne : 25-100€ par souscription**

### 3. TimeOne ⭐⭐
👉 https://www.timeonegroup.com

**Marques disponibles :**
- 📱 Orange Mobile
- 🌐 Orange Box
- ⚡ Eni, Plüm Énergie
- 🏠🚗 Groupama, MMA

💸 **Commission moyenne : 40-90€ par souscription**

### 4. CJ Affiliate (international) ⭐
👉 https://www.cj.com

Pour assurances internationales et néobanques.

---

## 📝 Étape par étape (pour Awin, exemple)

### Étape 1 — Inscription
1. Va sur https://www.awin.com/fr/devenir-affilie
2. Clique **"Devenir affilié"**
3. Remplis :
   - URL de ton site : `https://economio.vercel.app` (ou ton domaine)
   - Catégorie : **"Comparateurs de prix"**
   - Description : *"Comparateur d'offres mobile, énergie, internet et assurance avec analyse IA personnalisée"*
4. Paye les **5€** d'inscription (remboursés au 1er paiement)
5. Attends 1-3 jours la validation

### Étape 2 — Postuler aux programmes
1. Connecte-toi à ton compte Awin
2. Cherche par exemple **"Bouygues Telecom"**
3. Clique **"Rejoindre le programme"**
4. Le programme te valide en 24-72h

### Étape 3 — Récupérer ton lien
1. Une fois validé, clique sur le programme
2. Clique **"Liens & outils"** → **"Lien profond"**
3. Tu obtiens un lien type :
   ```
   https://www.awin1.com/cread.php?awinmid=12345&awinaffid=TON-ID&clickref=&p=https://www.bouyguestelecom.fr
   ```
4. **COPIE ce lien**

### Étape 4 — Coller dans Économio
1. Ouvre `src/App.jsx`
2. Trouve la section **`AFFILIATE_LINKS`** (vers la ligne 13)
3. Remplace `""` par ton lien :
   ```js
   "Bouygues":  "https://www.awin1.com/cread.php?awinmid=12345&awinaffid=TON-ID&...",
   ```
4. Sauvegarde, redéploie sur Vercel
5. ✅ Maintenant tu touches tes commissions !

---

## ⏱️ Délais de paiement

| Étape | Délai |
|---|---|
| Souscription utilisateur | Jour 0 |
| Validation par le fournisseur | 30-90 jours |
| Disponible dans ton compte Awin | +15 jours |
| Virement sur ton compte | 1er du mois suivant le seuil |

**Seuil de paiement Awin : 20€**

⚠️ Donc si quelqu'un souscrit en mai, tu touches l'argent en **juillet-août**.

---

## 💡 Astuces de pro

### Prioriser les programmes les plus rentables
Commission décroissante typique :
1. **Énergie** : 70-150€ (les plus juteuses)
2. **Assurances** : 50-100€
3. **Internet/Box** : 40-80€
4. **Mobile** : 20-50€

### Vérifier ses statistiques
Awin et Effiliation ont des dashboards en temps réel :
- Nombre de clics
- Taux de conversion
- Commissions générées
- Statut des validations

### Conditions de qualité
- **Pas de fraude** (clic sur ses propres liens)
- **Pas de promesses mensongères** sur le site
- **Mentions légales** présentes (oblig. RGPD)
- **Cookies** déclarés

---

## 🚨 À ne SURTOUT pas faire

❌ Cliquer sur tes propres liens depuis ta box internet (= bannissement immédiat)
❌ Promettre des économies impossibles ("Économisez 100% !")
❌ Cacher que tu touches une commission (illégal en France depuis 2023)
❌ Utiliser les marques sans autorisation (logos, nom)

✅ Économio le fait bien : disclaimer en bas de page mentionnant les commissions.

---

## 📊 Combien tu peux gagner ?

**Mois 1-3 (validation)** : 0-300€/mois
**Mois 4-6 (croissance)** : 300-1500€/mois
**Mois 7-12 (maturité)** : 1500-5000€/mois
**Année 2+ (avec SEO)** : potentiel 5000-30000€/mois

---

## 🎯 Plan d'action immédiat

**Cette semaine** :
- [ ] S'inscrire sur Awin
- [ ] S'inscrire sur Effiliation
- [ ] Postuler aux 5 programmes les plus rentables (énergie + assurance)

**Semaine prochaine** :
- [ ] Récupérer les liens validés
- [ ] Les coller dans `AFFILIATE_LINKS`
- [ ] Redéployer le site
- [ ] Tester en cliquant pour vérifier que ça redirige bien

**Le mois suivant** :
- [ ] Vérifier les premières commissions dans le dashboard
- [ ] Ajouter d'autres programmes si besoin

---

Bon courage ! 🚀
