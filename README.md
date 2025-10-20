# 📘 GUIDE COMPLET D'ADAPTATION DE A À Z

## 🎯 VUE D'ENSEMBLE

Tu as un wallet web qui fonctionne actuellement pour BC2. Pour l'adapter à une autre blockchain (Bitcoin, Litecoin, Dogecoin, etc.), tu dois :

1. ✅ **MODIFIER 1 SEUL FICHIER** : `src/blockchain-config.js`
2. ✅ **AJOUTER 1 LOGO** : `./nom-blockchain.png`
3. ✅ **CONFIGURER NGINX** : Pointer vers ton nœud RPC
4. ✅ **TESTER** : Vérifier que tout fonctionne

**Temps estimé : 15-30 minutes**

---

## 📂 ÉTAPE 1 : STRUCTURE DES FICHIERS

### Structure actuelle de ton projet :

```
/var/www/wallet-bc2/
├── index.html                    ← Ne PAS modifier
├── bc2.png                       ← Remplacer par ton logo
├── locales/
│   ├── en.json                   ← Optionnel : traduire
│   ├── fr.json
│   └── ...
├── src/
│   ├── blockchain-config.js      ← ⭐ SEUL FICHIER À MODIFIER
│   ├── app.js                    ← Ne PAS modifier
│   ├── config.js                 ← Ne PAS modifier
│   ├── wallet.js                 ← Ne PAS modifier
│   ├── blockchain.js             ← Ne PAS modifier
│   ├── transactions.js           ← Ne PAS modifier
│   ├── security.js               ← Ne PAS modifier
│   ├── ui-handlers.js            ← Ne PAS modifier
│   ├── ui-popups.js              ← Ne PAS modifier
│   ├── events.js                 ← Ne PAS modifier
│   ├── encryption.js             ← Ne PAS modifier
│   ├── rpc-manager.js            ← Ne PAS modifier
│   ├── vendor.js                 ← Ne PAS modifier
│   └── secure-operations.js      ← Ne PAS modifier
├── dist/
│   └── vendor-bundle.min.js      ← Ne PAS modifier
├── api/
│   └── get-counter.php           ← Ne PAS modifier
└── data/
    └── counter.txt               ← Ne PAS modifier
```

---

## 🔧 ÉTAPE 2 : LE FICHIER blockchain-config.js

### Localisation
**Chemin** : `/var/www/wallet-bc2/src/blockchain-config.js`

### Que contient ce fichier ?
Ce fichier contient **TOUTES** les informations spécifiques à la blockchain :
- Nom et symbole
- Paramètres réseau (préfixes d'adresses)
- Chemins de dérivation HD (BIP44)
- URLs des nœuds RPC
- URLs de l'explorateur
- Paramètres de fees
- Features activées

### Pourquoi UN SEUL fichier ?
Tous les autres fichiers JavaScript (app.js, wallet.js, blockchain.js, etc.) **importent** ce fichier et utilisent ses valeurs. Quand tu modifies `blockchain-config.js`, TOUT le wallet s'adapte automatiquement.

---

## 📝 ÉTAPE 3 : INFORMATIONS À COLLECTER

Avant de modifier le fichier, tu dois collecter ces informations sur ta blockchain cible.

### 3.1 - Informations de base

| Information | Exemple Bitcoin | Exemple Litecoin | Où trouver ? |
|------------|-----------------|------------------|--------------|
| **Nom court** | `BTC` | `LTC` | Site officiel |
| **Nom complet** | `Bitcoin` | `Litecoin` | Site officiel |
| **Symbole** | `BTC` | `LTC` | Site officiel |
| **Logo** | btc.png (256x256px) | ltc.png | Site officiel / Google Images |

### 3.2 - Paramètres réseau (CRITIQUE!)

Ces valeurs déterminent le format des adresses. **Si elles sont fausses, les adresses générées seront invalides.**

| Paramètre | Bitcoin | Litecoin | Dogecoin | Où trouver ? |
|-----------|---------|----------|----------|--------------|
| **bech32 prefix** | `bc` | `ltc` | `doge` | Documentation technique |
| **pubKeyHash** | `0x00` | `0x30` | `0x1E` | Repo GitHub (chainparams.cpp) |
| **scriptHash** | `0x05` | `0x32` | `0x16` | Repo GitHub (chainparams.cpp) |
| **wif** | `0x80` | `0xB0` | `0x9E` | Repo GitHub (chainparams.cpp) |
| **xpub version** | `0x0488B21E` | `0x019DA462` | `0x02FACAFD` | Repo GitHub (chainparams.cpp) |
| **xprv version** | `0x0488ADE4` | `0x019D9CFE` | `0x02FAC398` | Repo GitHub (chainparams.cpp) |

#### 📍 Où trouver ces valeurs EXACTEMENT ?

**Méthode 1 - Repository GitHub officiel** :
1. Va sur GitHub : `https://github.com/[blockchain-project]/[blockchain-name]`
2. Cherche le fichier : `src/chainparams.cpp` ou `src/validation.cpp`
3. Cherche les lignes contenant :
   - `base58Prefixes[PUBKEY_ADDRESS]` → `pubKeyHash`
   - `base58Prefixes[SCRIPT_ADDRESS]` → `scriptHash`
   - `base58Prefixes[SECRET_KEY]` → `wif`
   - `base58Prefixes[EXT_PUBLIC_KEY]` → `xpub`
   - `bech32_hrp` → `bech32 prefix`

**Méthode 2 - Documentation existante** :
- Bitcoin Wiki
- Blockchain Explorer (blockchair.com)
- Developer documentation

**Exemple pour Litecoin** :
```cpp
// Dans litecoin/src/chainparams.cpp
base58Prefixes[PUBKEY_ADDRESS] = std::vector<unsigned char>(1,48);  // 0x30
base58Prefixes[SCRIPT_ADDRESS] = std::vector<unsigned char>(1,50);  // 0x32
base58Prefixes[SECRET_KEY] = std::vector<unsigned char>(1,176);     // 0xB0
bech32_hrp = "ltc";
```

### 3.3 - Coin Type (BIP44)

Chaque blockchain a un numéro unique selon BIP44.

| Blockchain | Coin Type | Chemin HD |
|------------|-----------|-----------|
| Bitcoin | 0 | `m/44'/0'/0'` |
| Testnet | 1 | `m/44'/1'/0'` |
| Litecoin | 2 | `m/44'/2'/0'` |
| Dogecoin | 3 | `m/44'/3'/0'` |
| Dash | 5 | `m/44'/5'/0'` |

**Liste complète** : https://github.com/satoshilabs/slips/blob/master/slip-0044.md

### 3.4 - Nœud RPC

Tu as besoin d'un nœud RPC accessible :
- **IP** : Adresse IP du nœud (ex: 127.0.0.1)
- **Port** : Port RPC (ex: 8332 pour Bitcoin)
- **User** : Username RPC (dans bitcoin.conf)
- **Password** : Password RPC (dans bitcoin.conf)

**Configuration du nœud** (`~/.bitcoin/bitcoin.conf` ou équivalent) :
```conf
server=1
rpcuser=votreuser
rpcpassword=votrepass
rpcallowip=127.0.0.1
rpcport=8332
```

### 3.5 - Explorateur de blocs

URL de l'explorateur public (ex: blockstream.info pour Bitcoin).

| Blockchain | Explorateur Principal |
|------------|----------------------|
| Bitcoin | https://blockstream.info |
| Litecoin | https://blockchair.com/litecoin |
| Dogecoin | https://dogechain.info |

### 3.6 - Fees et Dust

| Paramètre | Bitcoin | Litecoin | Dogecoin | Description |
|-----------|---------|----------|----------|-------------|
| **minFeeRate** | 0.00001 | 0.00001 | 0.01 | Frais minimum (BTC/kB) |
| **Dust amount** | 546 sats | 546 sats | 10M sats | Montant minimal UTXO |

---

## 🛠️ ÉTAPE 4 : MODIFIER blockchain-config.js

### 4.1 - Ouvrir le fichier

```bash
cd /var/www/wallet-bc2/src
nano blockchain-config.js
```

### 4.2 - Structure du fichier

Le fichier est organisé en sections claires. Voici ce que tu dois modifier :

#### **Section 1 : BLOCKCHAIN IDENTITY**
```javascript
// === BLOCKCHAIN IDENTITY ===
NAME: 'BTC',              // Remplace par le nom court (ex: LTC, DOGE)
NAME_LOWER: 'btc',        // Version minuscule (pour localStorage)
NAME_FULL: 'Bitcoin',     // Nom complet affiché
```

**Exemple pour Litecoin** :
```javascript
NAME: 'LTC',
NAME_LOWER: 'ltc',
NAME_FULL: 'Litecoin',
```

#### **Section 2 : VISUAL ASSETS**
```javascript
// === VISUAL ASSETS ===
LOGO_PATH: './btc.png',      // Chemin vers ton logo
FAVICON_PATH: './btc.png',   // Même fichier
```

**Exemple pour Litecoin** :
```javascript
LOGO_PATH: './ltc.png',
FAVICON_PATH: './ltc.png',
```

⚠️ **Important** : Le logo doit être à la racine du projet (`/var/www/wallet-bc2/ltc.png`)

#### **Section 3 : UNITS AND SYMBOLS**
```javascript
// === UNITS AND SYMBOLS ===
UNITS: {
  symbol: 'BTC',          // Affiché partout dans l'interface
  decimals: 8,            // Ne PAS changer (toujours 8 pour Bitcoin-like)
  satoshiName: 'satoshi'  // Nom de la plus petite unité
},
```

**Exemple pour Litecoin** :
```javascript
UNITS: {
  symbol: 'LTC',
  decimals: 8,
  satoshiName: 'litoshi'
},
```

#### **Section 4 : NETWORK PARAMETERS** ⚠️ CRITIQUE!
```javascript
// === NETWORK PARAMETERS ===
NETWORK: {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',           // Préfixe Bech32 (adresses bc1...)
  bip32: {
    public: 0x0488B21E,   // Version xpub
    private: 0x0488ADE4   // Version xprv
  },
  pubKeyHash: 0x00,       // Adresses Legacy (1...)
  scriptHash: 0x05,       // Adresses P2SH (3...)
  wif: 0x80               // Format WIF des clés privées
},
```

**Exemple pour Litecoin** :
```javascript
NETWORK: {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',          // Adresses ltc1...
  bip32: {
    public: 0x019DA462,   // ⚠️ DIFFÉRENT!
    private: 0x019D9CFE   // ⚠️ DIFFÉRENT!
  },
  pubKeyHash: 0x30,       // Adresses L...
  scriptHash: 0x32,       // Adresses M...
  wif: 0xB0               // ⚠️ DIFFÉRENT!
},
```

#### **Section 5 : RPC NODES**
```javascript
// === RPC NODES ===
RPC_NODES: [
  {
    url: '/api/',         // Proxy Nginx vers ton nœud
    priority: 1,          // Plus bas = prioritaire
    timeout: 2000         // Timeout en ms
  },
  {
    url: '/api-custom/',  // Nœud de secours (optionnel)
    priority: 2,
    timeout: 2000
  }
],
```

**Tu peux garder tel quel** - La configuration Nginx gérera le proxy vers ton nœud.

#### **Section 6 : BLOCKCHAIN EXPLORERS**
```javascript
// === BLOCKCHAIN EXPLORERS ===
EXPLORERS: {
  primary: 'https://blockstream.info',           // Explorateur principal
  fallback: 'https://mempool.space',             // Explorateur de secours
  txPath: '/tx/',               // Chemin pour afficher une TX
  addressPath: '/address/'      // Chemin pour afficher une adresse
},
```

**Exemple pour Litecoin** :
```javascript
EXPLORERS: {
  primary: 'https://blockchair.com/litecoin',
  fallback: 'https://ltc.tokenview.io',
  txPath: '/transaction/',      // ⚠️ Peut être différent!
  addressPath: '/address/'
},
```

#### **Section 7 : TRANSACTION PARAMETERS**
```javascript
// === TRANSACTION PARAMETERS ===
TRANSACTION: {
  minFeeRate: 0.00001,          // Frais minimum (BTC/kB)
  dynamicFeeRate: 0.00001,      // Frais par défaut si RPC échoue
  maxUtxosPerBatch: 100,        // Max UTXOs par consolidation
  maxTxVbytes: 99000,           // Taille max TX
  
  // Montants "dust" par type d'adresse (en satoshis)
  dustAmounts: {
    p2pkh: 546,       // Legacy
    p2wpkh: 294,      // SegWit
    p2sh: 540,        // P2SH-SegWit
    p2tr: 330         // Taproot
  },
  
  minConsolidationFee: 0.00005,
  dustRelayAmount: 3000
},
```

**Exemple pour Dogecoin** (fees plus élevés) :
```javascript
TRANSACTION: {
  minFeeRate: 0.01,             // ⚠️ 1000x plus élevé!
  dynamicFeeRate: 0.01,
  maxUtxosPerBatch: 100,
  maxTxVbytes: 99000,
  dustAmounts: {
    p2pkh: 10000000,            // ⚠️ 100 DOGE!
    p2wpkh: 5000000,
    p2sh: 10000000,
    p2tr: 5000000
  },
  minConsolidationFee: 0.01,
  dustRelayAmount: 10000000
},
```

#### **Section 8 : HD DERIVATION PATHS** ⚠️ CRITIQUE!
```javascript
// === HD DERIVATION PATHS ===
HD_PATHS: {
  legacy: "m/44'/0'/0'",    // Le 0 = coin_type Bitcoin
  p2sh: "m/49'/0'/0'",
  bech32: "m/84'/0'/0'",
  taproot: "m/86'/0'/0'"
},
```

**Exemple pour Litecoin** (coin_type = 2) :
```javascript
HD_PATHS: {
  legacy: "m/44'/2'/0'",    // ⚠️ 2 au lieu de 0!
  p2sh: "m/49'/2'/0'",      // ⚠️ 2 au lieu de 0!
  bech32: "m/84'/2'/0'",    // ⚠️ 2 au lieu de 0!
  taproot: "m/86'/2'/0'"    // ⚠️ 2 au lieu de 0!
},
```

**Liste des coin_type** :
- Bitcoin: 0
- Testnet: 1
- Litecoin: 2
- Dogecoin: 3
- Dash: 5

#### **Section 9 : HD WALLET CONFIG**
```javascript
// === HD WALLET CONFIG ===
HD_CONFIG: {
  startRange: 512,          // Range initial de scan
  maxRange: 50000,          // Range maximum
  rangeSafety: 16,
  scanChunk: 50,
  scanMaxChunks: 40,
  defaultWordCount: 12      // 12 ou 24 mots
},
```

**Tu peux garder tel quel** - Ces valeurs fonctionnent pour toutes les blockchains.

#### **Section 10 : VALIDATION PATTERNS**
```javascript
// === VALIDATION PATTERNS ===
VALIDATION: {
  bech32Address: /^bc1[02-9ac-hj-np-z]{6,87}$/,      // Validation Bech32
  bech32mAddress: /^bc1p[02-9ac-hj-np-z]{6,87}$/,    // Validation Taproot
  legacyAddress: /^[13][1-9A-HJ-NP-Za-km-z]{25,39}$/, // Validation Legacy
  // ... (autres patterns standards)
},
```

**Exemple pour Litecoin** :
```javascript
VALIDATION: {
  bech32Address: /^ltc1[02-9ac-hj-np-z]{6,87}$/,     // ltc au lieu de bc
  bech32mAddress: /^ltc1p[02-9ac-hj-np-z]{6,87}$/,
  legacyAddress: /^[LM3][1-9A-HJ-NP-Za-km-z]{25,39}$/, // L, M ou 3
  // ...
},
```

#### **Section 11 : FOOTER**
```javascript
// === FOOTER ===
FOOTER: {
  githubUrl: 'https://github.com/bitcoin/bitcoin',
  officialSiteUrl: 'https://bitcoin.org/',
  officialSiteText: 'bitcoin.org 🚀',
  version: 'V3.0.0'
},
```

**Exemple pour Litecoin** :
```javascript
FOOTER: {
  githubUrl: 'https://github.com/litecoin-project/litecoin',
  officialSiteUrl: 'https://litecoin.org/',
  officialSiteText: 'litecoin.org ⚡',
  version: 'V3.0.0'
},
```

#### **Section 12 : FEATURES**
```javascript
// === FEATURES ===
FEATURES: {
  hdWallet: true,           // Support HD wallets
  taproot: true,            // Support Taproot (false pour Dogecoin)
  consolidation: true,      // Consolidation d'UTXOs
  emailLogin: true,         // Login email/password
  multiLanguage: true       // Support multilingue
}
```

**Exemple pour Dogecoin** (pas de Taproot) :
```javascript
FEATURES: {
  hdWallet: true,
  taproot: false,           // ⚠️ Dogecoin n'a pas Taproot
  consolidation: true,
  emailLogin: true,
  multiLanguage: true
}
```

### 4.3 - Sauvegarder

```bash
# Dans nano
Ctrl + O  (Write Out)
Entrée    (Confirmer)
Ctrl + X  (Exit)
```

---

## 🖼️ ÉTAPE 5 : AJOUTER LE LOGO

### 5.1 - Préparer le logo

**Requis** :
- Format : PNG
- Taille recommandée : 256x256px ou 512x512px
- Fond transparent (si possible)

### 5.2 - Uploader le logo

```bash
# Méthode 1 : SCP depuis ton ordinateur
scp /chemin/local/litecoin.png user@serveur:/var/www/wallet-bc2/ltc.png

# Méthode 2 : wget depuis une URL
cd /var/www/wallet-bc2
wget https://example.com/litecoin.png -O ltc.png

# Méthode 3 : Copier depuis un autre endroit du serveur
cp /chemin/vers/litecoin.png /var/www/wallet-bc2/ltc.png
```

### 5.3 - Vérifier les permissions

```bash
sudo chown www-data:www-data /var/www/wallet-bc2/ltc.png
sudo chmod 644 /var/www/wallet-bc2/ltc.png
```

---

## ⚙️ ÉTAPE 6 : CONFIGURER NGINX

### 6.1 - Encoder les credentials RPC en Base64

```bash
# Remplace 'rpcuser' et 'rpcpassword' par tes vraies valeurs
echo -n "rpcuser:rpcpassword" | base64

# Résultat exemple : cnBjdXNlcjpycGNwYXNzd29yZA==
```

### 6.2 - Éditer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/votre-domaine
```

### 6.3 - Configuration RPC Proxy

**Trouve cette section** :
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8332/;      # ← IP:Port de ton nœud
    proxy_set_header Authorization "Basic BASE64_ICI";  # ← Colle ton Base64
    # ...
}
```

**Modifie** :
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:9332/;      # ← Port Litecoin (exemple)
    proxy_set_header Authorization "Basic cnBjdXNlcjpycGNwYXNzd29yZA==";
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
}
```

**Si tu as un second nœud** (`/api-custom/`) :
```nginx
location /api-custom/ {
    proxy_pass http://192.168.1.100:9332/;  # ← Autre nœud
    proxy_set_header Authorization "Basic AUTRE_BASE64";
    # ... même config que ci-dessus
}
```

### 6.4 - Tester et recharger Nginx

```bash
# Tester la configuration
sudo nginx -t

# Si OK, recharger
sudo systemctl reload nginx

# Vérifier le statut
sudo systemctl status nginx
```

---

## ✅ ÉTAPE 7 : TESTER LE WALLET

### 7.1 - Ouvrir le wallet dans le navigateur

```
https://votre-domaine.com
```

### 7.2 - Test 1 : Vérifier l'affichage

✅ **Vérifie** :
- [ ] Le titre affiche le bon nom (ex: "Litecoin Wallet")
- [ ] Le logo s'affiche correctement
- [ ] Le symbole est correct partout (LTC au lieu de BC2)
- [ ] Le footer affiche les bons liens

### 7.3 - Test 2 : Générer une clé HD

1. Clic sur "Generate"
2. **Copie le mnemonic** (24 mots)
3. **Vérifie les adresses générées** :
   - Format Bech32 : `ltc1...` (pour Litecoin)
   - Format Taproot : `ltc1p...` (si supporté)

**Validation** :
- Utilise un outil externe pour vérifier (ex: iancoleman.io/bip39)
- Entre le même mnemonic
- Sélectionne "Litecoin" (ou ta blockchain)
- Vérifie que les adresses correspondent

### 7.4 - Test 3 : Importer un wallet existant

1. Utilise un mnemonic de test connu
2. Importe-le dans le wallet
3. Vérifie que les adresses correspondent à celles attendues

### 7.5 - Test 4 : Vérifier la connexion RPC

**Console navigateur** (F12) :
```javascript
// Teste la connexion RPC
await window.rpc('getblockchaininfo')

// Résultat attendu :
// { chain: "main", blocks: 123456, ... }
```

Si erreur :
- Vérifie que le nœud RPC est démarré
- Vérifie la config Nginx
- Vérifie les credentials Base64

### 7.6 - Test 5 : Transaction test (optionnel)

⚠️ **Utilise d'abord un testnet ou des montants minimes !**

1. Importe un wallet avec des fonds
2. Va dans "Send"
3. Entre une adresse de test
4. Entre un petit montant
5. Clic "Prepare"
6. Vérifie le TX hex généré
7. Clic "Broadcast" (si tu veux vraiment envoyer)

---

## 🚨 ÉTAPE 8 : DÉPANNAGE

### Problème 1 : Les adresses générées sont incorrectes

**Symptômes** :
- Adresses commencent par le mauvais préfixe
- Adresses invalides selon un validateur externe

**Solution** :
```javascript
// Vérifie dans blockchain-config.js :
NETWORK: {
  bech32: 'ltc',        // ← Doit correspondre au préfixe attendu
  pubKeyHash: 0x30,     // ← Doit correspondre aux specs de la blockchain
  // ...
}
```

### Problème 2 : RPC ne répond pas

**Symptômes** :
- Erreur dans la console : "RPC call failed"
- Impossible de récupérer le solde

**Solution** :
1. Vérifie que le nœud est lancé :
```bash
ps aux | grep litecoind  # (ou bitcoin, dogecoin, etc.)
```

2. Vérifie la config du nœud :
```bash
cat ~/.litecoin/litecoin.conf
# Doit contenir :
# server=1
# rpcuser=...
# rpcpassword=...
```

3. Teste le RPC manuellement :
```bash
curl --user rpcuser:rpcpass --data-binary '{"jsonrpc":"1.0","method":"getblockchaininfo","params":[]}' http://127.0.0.1:9332/
```

4. Vérifie Nginx :
```bash
sudo tail -f /var/log/nginx/error.log
```

### Problème 3 : Erreur "Invalid HD path"

**Symptômes** :
- Erreur lors de l'import d'un mnemonic HD
- Adresses HD incorrectes

**Solution** :
```javascript
// Vérifie dans blockchain-config.js :
HD_PATHS: {
  legacy: "m/44'/2'/0'",   // ← Le 2 doit être le coin_type de ta blockchain
  // ...
}
```

**Coin types** :
- Bitcoin: 0
- Litecoin: 2
- Dogecoin: 3
- etc.

### Problème 4 : Transactions échouent

**Symptômes** :
- Erreur "Insufficient funds" alors que tu as des fonds
- TX rejetée par le réseau

**Solution** :
```javascript
// Ajuste les fees dans blockchain-config.js :
TRANSACTION: {
  minFeeRate: 0.001,      // ← Augmente si nécessaire
  dustAmounts: {
    p2pkh: 10000,         // ← Ajuste selon la blockchain
  }
}
```

### Problème 5 : Logo ne s'affiche pas

**Solution** :
1. Vérifie le chemin :
```bash
ls -la /var/www/wallet-bc2/ltc.png
```

2. Vérifie les permissions :
```bash
sudo chmod 644 /var/www/wallet-bc2/ltc.png
```

3. Vérifie dans blockchain-config.js :
```javascript
LOGO_PATH: './ltc.png',   // ← Doit correspondre au nom du fichier
```

4. Vide le cache du navigateur (Ctrl+F5)

---

## 📋 CHECKLIST FINALE

### Configuration complète

- [ ] `blockchain-config.js` modifié avec toutes les bonnes valeurs
- [ ] Logo ajouté à la racine (`./nom.png`)
- [ ] Nginx configuré avec le bon proxy RPC
- [ ] Credentials RPC encodés en Base64
- [ ] Nginx rechargé sans erreur

### Tests

- [ ] Le wallet s'affiche avec le bon nom et logo
- [ ] Génération de clé HD fonctionne
- [ ] Adresses générées sont correctes (vérifiées avec outil externe)
- [ ] Import de wallet existant fonctionne
- [ ] Connexion RPC fonctionne (console navigateur)
- [ ] Affichage du solde fonctionne
- [ ] Transaction test réussie (optionnel)

### Production

- [ ] SSL/HTTPS configuré
- [ ] Sauvegarde de la config Nginx
- [ ] Documentation des changements
- [ ] Nœud RPC sécurisé (firewall)

---

## 📞 RESSOURCES UTILES

### Où trouver les paramètres réseau

1. **GitHub officiel** :
   - `src/chainparams.cpp` → Tous les paramètres réseau
   - `src/validation.cpp` → Règles de validation

2. **Documentation** :
   - Bitcoin Wiki
   - Blockchain Explorer (blockchair.com)
   - Developer documentation officielle

3. **Coin Types (BIP44)** :
   - https://github.com/satoshilabs/slips/blob/master/slip-0044.md

4. **Outil de vérification** :
   - https://iancoleman.io/bip39/ (pour tester les adresses HD)

### Exemples de configurations complètes

Dans l'artefact suivant, je te fournirai le fichier `blockchain-config.js` complet et commenté.

---

## ⏱️ RÉCAPITULATIF : Ce que tu dois faire

1. **Collecter les infos** (15 min)
   - Nom, symbole, logo
   - Paramètres réseau (chainparams.cpp)
   - Coin type (BIP44)
   - URL explorateur

2. **Modifier blockchain-config.js** (5 min)
   - Remplacer les valeurs par celles de ta blockchain

3. **Ajouter le logo** (2 min)
   - Upload à la racine du projet

4. **Configurer Nginx** (5 min)
   - Proxy RPC avec credentials Base64

5. **Tester** (5-10 min)
   - Génération, import, affichage, RPC

**Total : 30-40 minutes maximum**

---

✅ **Prêt pour le fichier blockchain-config.js complet ?**

Dans le prochain artefact, je vais te fournir le fichier final avec TOUS les commentaires explicatifs en anglais, prêt à être copié-collé.