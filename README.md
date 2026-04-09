# ATOS Sales Playbook

Application web de gestion des Sales Playbooks partenaires pour les Alliance Managers Atos.

## Fonctionnalités

- 11 partenaires pré-configurés : Microsoft (6 offres), Dell, Lenovo, Nexthink, ServiceNow, AvePoint, CloudiWay, Wimi, Nextcloud, Bleu, Delos
- 9 onglets par partenaire : Fiche Identité, Pitch & Marché, Valeur Ajoutée, Références, SWOT, Battle Card, Qualification, Contacts, Actualités
- Mode édition inline sur tous les champs
- Moteur de recherche par mot-clé
- Actualités avec filtres, épinglage et impact commercial
- Persistence des données via localStorage (conservées entre les sessions)
- Bouton Reset pour revenir aux données initiales

---

## Déploiement sur Vercel (recommandé — 5 minutes)

### Prérequis
- Compte GitHub gratuit : https://github.com
- Compte Vercel gratuit : https://vercel.com

### Étapes

**1. Mettre le projet sur GitHub**
```bash
# Depuis le dossier atos-playbook :
git init
git add .
git commit -m "Initial commit — Atos Sales Playbook"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/atos-playbook.git
git push -u origin main
```

**2. Déployer sur Vercel**
1. Allez sur https://vercel.com
2. Cliquez "Add New Project"
3. Sélectionnez votre repository GitHub `atos-playbook`
4. Vercel détecte automatiquement Vite — cliquez "Deploy"
5. En 2 minutes, votre app est disponible sur une URL du type : `https://atos-playbook-xxxx.vercel.app`

---

## Développement local

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

---

## Structure du projet

```
atos-playbook/
├── src/
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée React
│   ├── index.css            # Styles globaux
│   ├── data/
│   │   └── playbooks.js     # Toutes les données (11 partenaires)
│   ├── hooks/
│   │   └── usePlaybook.js   # Hook de gestion des données + localStorage
│   └── components/
│       ├── Sidebar.jsx      # Navigation latérale
│       ├── OfferTabs.jsx    # Onglets 0-6 (offre)
│       ├── ContactsTab.jsx  # Onglet contacts
│       ├── NewsTab.jsx      # Onglet actualités
│       └── ui.jsx           # Composants UI partagés
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## Ajouter un partenaire

1. Cliquez "+ Partenaire" dans la barre latérale
2. Remplissez le formulaire (nom, couleur, tier, offre principale, mots-clés)
3. Le mode édition s'active automatiquement
4. Complétez chaque onglet en cliquant sur les champs

## Mettre à jour les données par défaut

Éditez le fichier `src/data/playbooks.js` — le tableau `INITIAL_DATA` contient toutes les données.

> ⚠️ Le bouton "↺ Reset" dans l'application recharge les données depuis `INITIAL_DATA` et écrase le localStorage.

---

## Limitation connue

Les données sont sauvegardées dans le **localStorage du navigateur** de chaque utilisateur. Si plusieurs personnes accèdent à l'application, leurs modifications sont **indépendantes** — il n'y a pas de synchronisation en temps réel.

Pour une base de données partagée, il faudrait ajouter un backend (Supabase, Firebase, etc.).
