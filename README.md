# 🔧 Guide complet : Adapter le wallet à une nouvelle blockchain

> **Temps estimé** : 30-60 minutes  
> **Niveau** : Intermédiaire  
> **Prérequis** : Un nœud RPC de la blockchain cible doit être en fonction

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Étape 1 : Collecter les informations](#étape-1--collecter-les-informations)
4. [Étape 2 : Modifier blockchain-config.js](#étape-2--modifier-blockchain-configjs)
5. [Étape 3 : Ajouter le logo](#étape-3--ajouter-le-logo)
6. [Étape 4 : Configurer Nginx](#étape-4--configurer-nginx)
7. [Étape 5 : Tester le wallet](#étape-5--tester-le-wallet)
8. [Dépannage](#dépannage)
9. [Cas particuliers](#cas-particuliers)

---

## 🎯 Vue d'ensemble

Ce wallet web est conçu pour être facilement adapté à **n'importe quelle blockchain Bitcoin-like**. Il suffit de modifier **1 seul fichier** : `src/blockchain-config.js`.

### Ce qui est modifié
- ✅ `src/blockchain-config.js` (configuration blockchain)
- ✅ `./logo.png` (logo de la blockchain)
- ✅ Configuration Nginx (proxy RPC)

### Ce qui reste identique
- ❌ Tous les autres fichiers JavaScript
- ❌ La structure HTML
- ❌ Les traductions (optionnel)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Un nœud RPC fonctionnel** de la blockchain cible
   - Synchronisé
   - RPC activé (rpcuser, rpcpassword, rpcport configurés)
   - Accessible depuis votre serveur web

2. **Accès SSH au serveur** où le wallet est hébergé

3. **Les informations suivantes** :
   - Nom de la blockchain
   - Symbole (ticker)
   - Logo (PNG 256x256px minimum)
   - URL d'un explorateur de blocs

---

## 📝 Étape 1 : Collecter les informations

### 1.1 - Informations de base

| Information | Exemple | Votre valeur |
|------------|---------|--------------|
| Nom court | `FIX` | _________ |
| Nom complet | `FixrdCoin` | _________ |
| Symbole | `FIX` | _________ |
| URL explorateur | `https://explorer.fixedcoin.org` | _________ |

### 1.2 - Vérifier le coin_type (BIP44)

**TRÈS IMPORTANT** : Le `coin_type` doit correspondre à celui utilisé par le wallet officiel de votre blockchain.

#### Méthode 1 : Depuis le wallet officiel (RECOMMANDÉ)

Si vous avez accès au wallet officiel de votre blockchain :

```bash
# Créer un wallet temporaire
your-coin-cli createwallet "test"

# Obtenir les descriptors
your-coin-cli listdescriptors

# Cherchez les lignes contenant :
# - .../44'/X'/0'... → coin_type pour Legacy
# - .../84'/X'/0'... → coin_type pour Bech32
# - .../86'/X'/0'... → coin_type pour Taproot

# Supprimer le wallet test
your-coin-cli unloadwallet "test"
```

**Le numéro X que vous voyez est votre coin_type !**

#### Méthode 2 : Liste officielle BIP44

Consultez la [liste SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) :

| Blockchain | Coin Type |
|------------|-----------|
| Bitcoin | 0 |
| Testnet | 1 |
| Litecoin | 2 |
| Dogecoin | 3 |
| Dash | 5 |

**Si votre blockchain n'est pas listée** : Elle utilise probablement `coin_type = 0` (comme Bitcoin).

### 1.3 - Identifier le préfixe Bech32

Générez une adresse Bech32 depuis votre nœud RPC :

```bash
# Méthode 1 : Via curl (remplacez les credentials)
curl -X POST http://IP:PORT/ \
  --user rpcuser:rpcpass \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"1.0","method":"getnewaddress","params":["","bech32"]}'

# Méthode 2 : Via le CLI
your-coin-cli getnewaddress "" bech32
```

**Résultat exemple** : `fix1qsg4vkqksmah5q5v5nr47zhr9l8lgh79tfmly8m`

Le préfixe est : `fix` (tout ce qui est avant le `1`)

### 1.4 - Configuration RPC du nœud

Notez ces informations depuis la config de votre nœud :

```bash
cat ~/.your-coin/your-coin.conf
```

| Information | Exemple | Votre valeur |
|------------|---------|--------------|
| IP du nœud | `217.160.149.211` | _________ |
| Port RPC | `24761` | _________ |
| rpcuser | `user` | _________ |
| rpcpassword | `pass` | _________ |

### 1.5 - Vérifier les formats d'adresses supportés

Testez tous les formats d'adresses :

```bash
# Si vous utilisez un proxy Nginx déjà configuré, remplacez l'URL
WALLET_URL="https://your-wallet-domain.com/api/"

# Legacy (P2PKH)
curl -X POST $WALLET_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"1.0","method":"getnewaddress","params":["","legacy"]}'

# P2SH-SegWit
curl -X POST $WALLET_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"1.0","method":"getnewaddress","params":["","p2sh-segwit"]}'

# Bech32 (Native SegWit)
curl -X POST $WALLET_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"1.0","method":"getnewaddress","params":["","bech32"]}'

# Taproot
curl -X POST $WALLET_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"1.0","method":"getnewaddress","params":["","bech32m"]}'
```

**Notez les formats qui fonctionnent** :
- ✅ Bech32 : Oui / Non
- ✅ Taproot : Oui / Non
- ✅ Legacy : Oui / Non
- ✅ P2SH : Oui / Non

---

## 🛠️ Étape 2 : Modifier blockchain-config.js

### 2.1 - Localiser le fichier

```bash
cd /var/www/wallet-YOUR-COIN/src
sudo cp blockchain-config.js blockchain-config.js.backup
sudo nano blockchain-config.js
```

### 2.2 - Sections à modifier

#### Section 1 : Identité de la blockchain

```javascript
NAME: 'FIX',                    // Votre symbole
NAME_LOWER: 'fix',              // En minuscules
NAME_FULL: 'FixrdCoin',         // Nom complet
```

#### Section 2 : Logo et favicon

```javascript
LOGO_PATH: './fix.png',         // Nom de votre fichier logo
FAVICON_PATH: './fix.png',      // Même fichier
```

#### Section 3 : Unités et symboles

```javascript
UNITS: {
  symbol: 'FIX',                // Symbole affiché partout
  decimals: 8,                  // Toujours 8 pour Bitcoin-like
  satoshiName: 'fixoshi'        // Plus petite unité (optionnel)
},
```

#### Section 4 : Paramètres réseau

```javascript
NETWORK: {
  messagePrefix: '\x18FixrdCoin Signed Message:\n',  // Changez le nom
  bech32: 'fix',                                      // Préfixe Bech32 trouvé à l'étape 1.3
  
  // Ces valeurs sont standard pour Bitcoin-like
  // Changez UNIQUEMENT si votre blockchain utilise des valeurs différentes
  bip32: {
    public: 0x0488B21E,         // xpub version (Bitcoin standard)
    private: 0x0488ADE4          // xprv version (Bitcoin standard)
  },
  pubKeyHash: 0x00,             // Legacy address prefix (Bitcoin standard)
  scriptHash: 0x05,             // P2SH address prefix (Bitcoin standard)
  wif: 0x80                     // WIF private key format (Bitcoin standard)
},
```

⚠️ **IMPORTANT** : Si votre blockchain utilise des adresses Legacy/P2SH non-standard (première lettre qui change), voir [Cas particuliers](#cas-particuliers).

#### Section 5 : Chemins de dérivation HD (CRITIQUE!)

```javascript
HD_PATHS: {
  legacy: "m/44'/0'/0'",        // Remplacez 0 par votre coin_type
  p2sh: "m/49'/0'/0'",          // Remplacez 0 par votre coin_type
  bech32: "m/84'/0'/0'",        // Remplacez 0 par votre coin_type
  taproot: "m/86'/0'/0'"        // Remplacez 0 par votre coin_type
},
```

**Exemple** : Si votre `coin_type = 0` (comme FixrdCoin ou Bitcoin), laissez tel quel.

#### Section 6 : Explorateur de blocs

```javascript
EXPLORERS: {
  primary: 'https://explorer.fixedcoin.org',    // URL de votre explorateur
  fallback: 'https://explorer.fixedcoin.org',   // Même URL ou alternative
  txPath: '/tx/',                                // Chemin pour les transactions
  addressPath: '/address/'                       // Chemin pour les adresses
},
```

**Comment trouver les chemins ?** Allez sur votre explorateur et regardez l'URL d'une transaction :
- `https://explorer.com/tx/abc123` → `txPath: '/tx/'`
- `https://explorer.com/transaction/abc123` → `txPath: '/transaction/'`

#### Section 7 : Paramètres de transactions

```javascript
TRANSACTION: {
  minFeeRate: 0.00001,          // Frais minimum (en COIN/kB)
  dynamicFeeRate: 0.00001,      // Idem
  
  // Dust amounts (montants minimaux par type d'adresse, en satoshis)
  dustAmounts: {
    p2pkh: 546,
    p2wpkh: 294,
    p2sh: 540,
    p2tr: 330
  },
  
  // Laissez ces valeurs par défaut
  maxUtxosPerBatch: 100,
  maxTxVbytes: 99000,
  minConsolidationFee: 0.00005,
  dustRelayAmount: 3000
},
```

#### Section 8 : Footer

```javascript
FOOTER: {
  githubUrl: 'https://github.com/your-blockchain/your-coin',
  officialSiteUrl: 'https://your-coin.org/',
  officialSiteText: 'your-coin.org 🚀',
  version: 'V3.0.0'
},
```

#### Section 9 : Features (fonctionnalités)

```javascript
FEATURES: {
  hdWallet: true,               // Support HD wallets
  taproot: true,                // Support Taproot (mettez false si non supporté)
  consolidation: true,          // Consolidation d'UTXOs
  emailLogin: true,             // Login email/password
  multiLanguage: true           // Support multilingue
}
```

### 2.3 - Sauvegarder

```bash
# Dans nano :
Ctrl + O  → Sauvegarder
Entrée    → Confirmer
Ctrl + X  → Quitter
```

---

## 🖼️ Étape 3 : Ajouter le logo

### 3.1 - Préparer le logo

**Spécifications** :
- Format : PNG
- Taille : 256x256px ou 512x512px
- Fond transparent recommandé

### 3.2 - Uploader le logo

```bash
# Méthode 1 : SCP depuis votre PC
scp /path/to/logo.png user@server:/var/www/wallet-YOUR-COIN/your-coin.png

# Méthode 2 : wget depuis une URL
cd /var/www/wallet-YOUR-COIN
wget https://example.com/logo.png -O your-coin.png

# Méthode 3 : Copier depuis le serveur
cp /path/to/logo.png /var/www/wallet-YOUR-COIN/your-coin.png
```

### 3.3 - Définir les permissions

```bash
cd /var/www/wallet-YOUR-COIN
sudo chown www-data:www-data your-coin.png
sudo chmod 644 your-coin.png

# Vérifier
ls -la your-coin.png
```

---

## ⚙️ Étape 4 : Configurer Nginx

### 4.1 - Encoder les credentials RPC en Base64

```bash
# Remplacez user et pass par vos vraies valeurs
echo -n "user:pass" | base64

# Résultat exemple : dXNlcjpwYXNz
# Notez cette valeur, vous en aurez besoin !
```

### 4.2 - Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/wallet-your-coin.domain.com
```

**Collez cette configuration** (adaptez les valeurs) :

```nginx
server {
    listen 80;
    server_name wallet-your-coin.domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wallet-your-coin.domain.com;

    # Certificat SSL (sera généré par certbot)
    ssl_certificate /etc/letsencrypt/live/wallet-your-coin.domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wallet-your-coin.domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://your-explorer.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;" always;

    root /var/www/wallet-YOUR-COIN;
    index index.html;

    # API PHP (compteur de wallets)
    location ~ ^/api/(get-counter\.php|increment-counter\.php)$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    # Proxy RPC principal
    location /api/ {
        proxy_connect_timeout 1s;
        proxy_read_timeout 2s;
        proxy_send_timeout 1s;

        proxy_pass http://NODE_IP:NODE_PORT/;  # ← MODIFIEZ ICI
        proxy_http_version 1.1;

        proxy_set_header Authorization "Basic YOUR_BASE64_HERE";  # ← MODIFIEZ ICI
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Proxy RPC de secours (optionnel)
    location /api-custom/ {
        proxy_connect_timeout 1s;
        proxy_read_timeout 2s;
        proxy_send_timeout 1s;

        proxy_pass http://BACKUP_NODE_IP:BACKUP_NODE_PORT/;  # ← MODIFIEZ ICI
        proxy_http_version 1.1;

        proxy_set_header Authorization "Basic YOUR_BASE64_HERE";  # ← MODIFIEZ ICI
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Proxy explorateur
    location /explorer/ {
        proxy_connect_timeout 3s;
        proxy_read_timeout 5s;
        proxy_send_timeout 3s;

        proxy_pass https://your-explorer.com/;  # ← MODIFIEZ ICI
        proxy_http_version 1.1;

        proxy_set_header Host your-explorer.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Fichiers statiques
    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
        try_files $uri $uri/ /index.html;
    }
}
```

**À modifier dans le fichier ci-dessus** :
1. `wallet-your-coin.domain.com` → Votre domaine
2. `/var/www/wallet-YOUR-COIN` → Votre chemin
3. `http://NODE_IP:NODE_PORT/` → IP:Port de votre nœud RPC
4. `Basic YOUR_BASE64_HERE` → Le Base64 de l'étape 4.1
5. `https://your-explorer.com/` → URL de votre explorateur

### 4.3 - Activer le site (sans SSL pour l'instant)

D'abord, créez une version HTTP simple pour générer le certificat SSL :

```bash
sudo nano /etc/nginx/sites-available/wallet-your-coin.domain.com
```

**Version temporaire HTTP** :

```nginx
server {
    listen 80;
    server_name wallet-your-coin.domain.com;

    root /var/www/wallet-YOUR-COIN;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/wallet-your-coin.domain.com /etc/nginx/sites-enabled/

# Tester
sudo nginx -t

# Recharger
sudo systemctl reload nginx
```

### 4.4 - Générer le certificat SSL

```bash
# Installer certbot si nécessaire
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Générer le certificat
sudo certbot --nginx -d wallet-your-coin.domain.com
```

### 4.5 - Remplacer par la configuration complète

Maintenant que le certificat existe, remplacez par la config complète de l'étape 4.2 :

```bash
sudo nano /etc/nginx/sites-available/wallet-your-coin.domain.com

# → Collez la configuration complète de l'étape 4.2
# → Sauvegardez

# Tester
sudo nginx -t

# Recharger
sudo systemctl reload nginx
```

### 4.6 - Configurer les permissions PHP

```bash
cd /var/www/wallet-YOUR-COIN
sudo chown -R www-data:www-data data/
sudo chmod 600 data/counter.txt
```

---

## ✅ Étape 5 : Tester le wallet

### 5.1 - Test 1 : Accès au wallet

```bash
# Ouvrez dans votre navigateur
https://wallet-your-coin.domain.com
```

**Vérifiez** :
- ✅ Le site se charge en HTTPS
- ✅ Le logo s'affiche
- ✅ Le nom de la blockchain est correct
- ✅ Le symbole est correct partout

### 5.2 - Test 2 : Connexion RPC

Ouvrez la console navigateur (F12) et tapez :

```javascript
await window.rpc('getblockchaininfo')
```

**Résultat attendu** : Un objet JSON avec les infos de la blockchain :
```javascript
{
  chain: "main",
  blocks: 329,
  headers: 329,
  bestblockhash: "000000...",
  ...
}
```

**Si erreur** → Voir [Dépannage](#dépannage)

### 5.3 - Test 3 : Génération d'adresses

1. Cliquez sur **"Generate"**
2. Notez le mnemonic (12 ou 24 mots)
3. **Vérifiez les adresses affichées** :
   - Bech32 : `yourprefix1q...`
   - Taproot : `yourprefix1p...` (si supporté)

### 5.4 - Test 4 : Vérification avec le nœud officiel

**CRITIQUE** : Vérifiez que les adresses générées correspondent à celles du wallet officiel.

#### Option A : Via iancoleman.io/bip39

1. Allez sur https://iancoleman.io/bip39/
2. Entrez votre mnemonic de test
3. Sélectionnez votre blockchain dans la liste
4. Comparez les adresses avec celles du wallet web

⚠️ **Les adresses doivent être IDENTIQUES**

#### Option B : Importer dans le wallet officiel

1. Importez le mnemonic dans le wallet officiel
2. Comparez les adresses

### 5.5 - Test 5 : Import d'un wallet existant

1. Créez un wallet de test avec le wallet officiel
2. Exportez le mnemonic ou xprv
3. Importez-le dans le wallet web
4. **Vérifiez que les adresses correspondent**

### 5.6 - Test 6 : Transaction de test

⚠️ **Utilisez un montant minimal pour ce test !**

1. Importez un wallet avec des fonds
2. Cliquez sur "Send"
3. Entrez une adresse de destination
4. Entrez un petit montant
5. Cliquez sur "Prepare"
6. **Vérifiez le TX hex généré**
7. Cliquez sur "Broadcast"
8. Vérifiez dans l'explorateur que la TX a été diffusée

---

## 🚨 Dépannage

### Problème : RPC ne répond pas

**Symptômes** :
```
[RPC-MANAGER] Node 0 error: HTTP 500
```

**Solutions** :

1. **Vérifier que le nœud RPC tourne** :
```bash
ps aux | grep your-coin
```

2. **Tester le RPC manuellement** :
```bash
curl --user rpcuser:rpcpass \
  --data-binary '{"jsonrpc":"1.0","method":"getblockchaininfo","params":[]}' \
  http://NODE_IP:NODE_PORT/
```

3. **Vérifier les logs Nginx** :
```bash
sudo tail -f /var/log/nginx/error.log
```

4. **Vérifier le firewall** (si le nœud est sur un serveur distant) :
```bash
# Sur le serveur du nœud
sudo ufw allow from SERVER_WEB_IP to any port NODE_RPC_PORT
```

### Problème : Adresses générées incorrectes

**Symptômes** :
- Les adresses ne correspondent pas au wallet officiel
- Format d'adresse invalide

**Solutions** :

1. **Vérifier le coin_type** dans `blockchain-config.js` :
```javascript
HD_PATHS: {
  bech32: "m/84'/0'/0'",  // ← Le 0 doit être votre coin_type
  taproot: "m/86'/0'/0'"
}
```

2. **Vérifier le préfixe Bech32** :
```javascript
NETWORK: {
  bech32: 'fix',  // ← Doit correspondre à vos adresses
}
```

3. **Comparer avec iancoleman.io/bip39** avec le même mnemonic

### Problème : Erreur "Address is not valid"

**Symptômes** :
```
[RPC-MANAGER] Node error: Address is not valid
```

**Cause** : Le wallet essaie de scanner des formats d'adresses non supportés par votre blockchain.

**Solution** : Désactiver les formats non supportés dans `blockchain-config.js` :

```javascript
HD_PATHS: {
  legacy: null,       // Désactiver si non supporté
  p2sh: null,         // Désactiver si non supporté
  bech32: "m/84'/0'/0'",
  taproot: "m/86'/0'/0'"
}
```

### Problème : Logo ne s'affiche pas

**Solutions** :

1. **Vérifier que le fichier existe** :
```bash
ls -la /var/www/wallet-YOUR-COIN/your-coin.png
```

2. **Vérifier les permissions** :
```bash
sudo chmod 644 /var/www/wallet-YOUR-COIN/your-coin.png
sudo chown www-data:www-data /var/www/wallet-YOUR-COIN/your-coin.png
```

3. **Vider le cache du navigateur** : `Ctrl + Shift + R`

### Problème : Certificat SSL expiré

```bash
# Renouveler manuellement
sudo certbot renew

# Ou forcer le renouvellement
sudo certbot renew --force-renewal
```

---

## 🔬 Cas particuliers

### Cas 1 : Adresses Legacy non-standard

**Symptôme** : Les adresses Legacy de votre blockchain ont des premières lettres qui changent (a, b, d, e, f, etc.) au lieu d'être identiques.

**Exemple** : FixrdCoin

**Solution** : Désactiver le support Legacy/P2SH et utiliser uniquement Bech32/Taproot :

```javascript
HD_PATHS: {
  legacy: null,               // Désactivé
  p2sh: null,                 // Désactivé
  bech32: "m/84'/0'/0'",      // Activé
  taproot: "m/86'/0'/0'"      // Activé
}
```

### Cas 2 : Blockchain sans Taproot

**Exemple** : Dogecoin, anciennes blockchains

**Solution** :

```javascript
FEATURES: {
  taproot: false,  // Désactiver Taproot
  // ...
}

HD_PATHS: {
  legacy: "m/44'/3'/0'",
  p2sh: "m/49'/3'/0'",
  bech32: "m/84'/3'/0'",
  taproot: null              // Désactivé
}
```

### Cas 3 : Nœud RPC sur un serveur distant

**Configuration du nœud distant** (`~/.your-coin/your-coin.conf`) :

```conf
# Écouter sur toutes les interfaces
rpcbind=0.0.0.0

# Autoriser l'IP du serveur web
rpcallowip=IP_SERVEUR_WEB

# Port RPC
rpcport=24761
```

**Redémarrer le nœud** :
```bash
your-coin-cli stop
your-coind -daemon
```

**Firewall** :
```bash
sudo ufw allow from IP_SERVEUR_WEB to any port 24761
```

### Cas 4 : Plusieurs nœuds RPC (failover)

Si vous avez plusieurs nœuds RPC pour la redondance :

**Dans `blockchain-config.js`** :
```javascript
RPC_NODES: [
  {
    url: '/api/',           // Nœud principal
    priority: 1,
    timeout: 2000
  },
  {
    url: '/api-custom/',    // Nœud de secours
    priority: 2,
    timeout: 2000
  }
],
```

**Dans Nginx** : Configurez les deux `location /api/` et `location /api-custom/` avec des nœuds différents.

---

## 📋 Checklist finale

Avant de mettre en production :

### Configuration
- [ ] `blockchain-config.js` modifié avec les bonnes valeurs
- [ ] coin_type vérifié avec le wallet officiel
- [ ] Logo ajouté et permissions OK
- [ ] Configuration Nginx complète
- [ ] Certificat SSL valide

### Tests
- [ ] Site accessible en HTTPS
- [ ] RPC répond (console : `await window.rpc('getblockchaininfo')`)
- [ ] Génération d'adresses fonctionne
- [ ] Adresses correspondent au wallet officiel (vérifiées avec iancoleman.io)
- [ ] Import de wallet existant fonctionne
- [ ] Balance s'affiche correctement
- [ ] Transaction de test réussie

### Sécurité
- [ ] Nœud RPC sécurisé (firewall)
- [ ] Credentials RPC forts
- [ ] HTTPS activé avec HSTS
- [ ] Sauvegarde de la configuration effectuée

---

## 📞 Ressources

- [Liste SLIP-0044 (coin types)](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- [Outil BIP39/BIP44](https://iancoleman.io/bip39/)
- [Documentation Bitcoin Core RPC](https://developer.bitcoin.org/reference/rpc/)

---

## 🎉 Félicitations !

Votre wallet est maintenant configuré pour votre blockchain ! 🚀

Si vous rencontrez des problèmes non couverts par ce guide, vérifiez :
1. Les logs du nœud RPC
2. Les logs Nginx (`/var/log/nginx/error.log`)
3. La console navigateur (F12)

**Bon launch ! 🎊**
