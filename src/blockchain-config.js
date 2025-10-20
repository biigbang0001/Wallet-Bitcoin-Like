// ============================================================================================================
// BLOCKCHAIN CONFIGURATION FILE - FIXRDCOIN (FIX)
// ============================================================================================================
// This is the ONLY file you need to modify to adapt this wallet to any Bitcoin-like blockchain
// All other files automatically use these values
// ============================================================================================================

export const BLOCKCHAIN_CONFIG = {

  // ==========================================================================================================
  // SECTION 1: CRITICAL BLOCKCHAIN IDENTITY
  // ==========================================================================================================
  // These values define your blockchain's name and visual identity throughout the entire wallet
  
  NAME: 'FIX',                           // Short name (displayed everywhere)
  NAME_LOWER: 'fix',                     // Lowercase version (used for localStorage keys)
  NAME_FULL: 'FixrdCoin',                // Full name (displayed in headers and titles)
  
  LOGO_PATH: './fix.png',                // Path to your blockchain logo
  FAVICON_PATH: './fix.png',             // Path to favicon
  
  
  // ==========================================================================================================
  // SECTION 2: CRITICAL NETWORK PARAMETERS
  // ==========================================================================================================
  // These are the MOST IMPORTANT values - they define how addresses are generated
  // Wrong values = wrong addresses = lost funds!
  // Values extracted from FixrdCoin source code (chainparams.cpp)
  
  NETWORK: {
    messagePrefix: '\x18FixrdCoin Signed Message:\n',    // Message signing prefix
    
    bech32: 'fix',                                       // Bech32 address prefix (fix1...)
    
    pubKeyHash: 0x01,                                    // Legacy address version byte (P2PKH)
                                                         // FixrdCoin: 0x01 (non-standard, creates variable first letters)
    
    scriptHash: 0x00,                                    // P2SH address version byte
                                                         // FixrdCoin: 0x00 (unusual - P2SH addresses start with '1')
    
    wif: 0x80,                                           // WIF private key version byte
                                                         // FixrdCoin: 0x80 (standard Bitcoin value)
    
    bip32: {
      public: 0x0488B21E,                                // Extended public key version (xpub)
                                                         // FixrdCoin: 0x0488B21E (standard Bitcoin value)
      
      private: 0x0488ADE4                                // Extended private key version (xprv)
                                                         // FixrdCoin: 0x0488ADE4 (standard Bitcoin value)
    }
  },
  
  
  // ==========================================================================================================
  // SECTION 3: BIP44 HD WALLET DERIVATION PATHS
  // ==========================================================================================================
  // Format: m/purpose'/coin_type'/account'/change/address_index
  // FixrdCoin uses coin_type = 0 (same as Bitcoin) - verified from official wallet descriptors
  
  HD_PATHS: {
    legacy: "m/44'/0'/0'",                               // BIP44 - Legacy P2PKH addresses
    p2sh: "m/49'/0'/0'",                                 // BIP49 - P2SH-wrapped SegWit
    bech32: "m/84'/0'/0'",                               // BIP84 - Native SegWit (fix1q...)
    taproot: "m/86'/0'/0'"                               // BIP86 - Taproot (fix1p...)
  },
  
  
  // ==========================================================================================================
  // SECTION 4: RPC NODES CONFIGURATION
  // ==========================================================================================================
  // Your wallet will connect to these nodes to interact with the blockchain
  // Automatic failover if primary node is down
  
  RPC_NODES: [
    {
      url: '/api/',                                      // Primary RPC endpoint (proxied through Nginx)
      priority: 1,                                       // Lower number = higher priority
      timeout: 2000                                      // Request timeout in milliseconds
    },
    {
      url: '/api-custom/',                               // Backup RPC endpoint (optional)
      priority: 2,
      timeout: 2000
    }
  ],
  
  
  // ==========================================================================================================
  // SECTION 5: BLOCKCHAIN EXPLORERS
  // ==========================================================================================================
  // Used to generate links to view transactions and addresses
  
  EXPLORERS: {
    primary: 'https://explorer.fixedcoin.org',           // Primary block explorer URL
    fallback: 'https://explorer.fixedcoin.org',          // Fallback explorer
    txPath: '/tx/',                                      // Path format for transactions
    addressPath: '/address/'                             // Path format for addresses
  },
  
  
  // ==========================================================================================================
  // SECTION 6: TRANSACTION PARAMETERS
  // ==========================================================================================================
  // Fee rates are fetched dynamically from the network, these are fallback minimums
  
  TRANSACTION: {
    minFeeRate: 0.00001,                                 // Minimum fee rate in FIX/kB
    dynamicFeeRate: 0.00001,                             // Dynamic fee rate (fetched from network)
    
    maxUtxosPerBatch: 100,                               // Maximum UTXOs per consolidation batch
    maxTxVbytes: 99000,                                  // Maximum transaction size in virtual bytes
    
    dustAmounts: {                                       // Dust limits per address type (in satoshis)
      p2pkh: 546,                                        // Legacy
      p2wpkh: 294,                                       // Native SegWit
      p2sh: 540,                                         // P2SH-wrapped SegWit
      p2tr: 330                                          // Taproot
    },
    
    minConsolidationFee: 0.00005,                        // Minimum fee for consolidation transactions
    dustRelayAmount: 3000                                // Standard dust relay amount
  },
  
  
  // ==========================================================================================================
  // SECTION 7: DISPLAY UNITS
  // ==========================================================================================================
  
  UNITS: {
    symbol: 'FIX',                                       // Currency symbol displayed everywhere
    decimals: 8,                                         // Number of decimal places (always 8)
    satoshiName: 'fixoshi'                               // Name of smallest unit
  },
  
  
  // ==========================================================================================================
  // SECTION 8: UTXO VALUE THRESHOLDS
  // ==========================================================================================================
  // These values determine which UTXOs can be used in different contexts
  
  UTXO_VALUES: {
    minTransaction: 777,                                 // Minimum UTXO value for normal transactions (satoshis)
    dustRelay: 3000,                                     // Standard dust relay threshold (satoshis)
    minConsolidation: 546                                // Minimum UTXO value for consolidation (satoshis)
  },
  
  
  // ==========================================================================================================
  // SECTION 9: HD WALLET SCANNING CONFIGURATION
  // ==========================================================================================================
  // These parameters control how the wallet scans for HD wallet addresses
  
  HD_CONFIG: {
    startRange: 512,                                     // Initial range for descriptor-based scanning
    maxRange: 50000,                                     // Maximum addresses to scan
    rangeSafety: 16,                                     // Safety margin for address gap
    scanChunk: 50,                                       // Addresses per scan chunk
    scanMaxChunks: 40,                                   // Maximum number of chunks to scan
    defaultWordCount: 12                                 // Default mnemonic length (12 or 24)
  },
  
  
  // ==========================================================================================================
  // SECTION 10: ADDRESS VALIDATION PATTERNS
  // ==========================================================================================================
  // Regular expressions for validating different address formats
  // FixrdCoin uses non-standard address prefixes, so validation is more permissive
  
  VALIDATION: {
    bech32Address: /^fix1[02-9ac-hj-np-z]{6,87}$/,       // Native SegWit (Bech32) - fix1q...
    bech32mAddress: /^fix1p[02-9ac-hj-np-z]{6,87}$/,     // Taproot (Bech32m) - fix1p...
    legacyAddress: /^[1-9A-HJ-NP-Za-km-z]{25,39}$/,      // Legacy P2PKH/P2SH (permissive - FixrdCoin has variable prefixes)
    wif: /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/,           // WIF private key
    hexPrivateKey: /^[0-9a-fA-F]{64}$/,                  // Hex private key
    xprv: /^xprv[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/, // Extended private key
    scriptHex: /^[0-9a-fA-F]*$/,                         // Script hex
    txid: /^[0-9a-fA-F]{64}$/,                           // Transaction ID
    amount: /^\d+(\.\d{1,8})?$/,                         // Amount format
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/                  // Email format
  },
  
  
  // ==========================================================================================================
  // SECTION 11: API ENDPOINTS
  // ==========================================================================================================
  
  API: {
    counterGet: '/api/get-counter.php',
    counterIncrement: '/api/get-counter.php'
  },
  
  
  // ==========================================================================================================
  // SECTION 12: FOOTER CONFIGURATION
  // ==========================================================================================================
  
  FOOTER: {
    githubUrl: 'https://github.com/fixedcoin/fixedcoin',
    officialSiteUrl: 'https://fixedcoin.org/',
    officialSiteText: 'fixedcoin.org 🚀',
    version: 'V3.0.0'
  },
  
  
  // ==========================================================================================================
  // SECTION 13: FEATURE FLAGS
  // ==========================================================================================================
  // Enable or disable specific features
  
  FEATURES: {
    hdWallet: true,                                      // Enable HD wallet support (mnemonic/xprv)
    taproot: true,                                       // Enable Taproot/Bech32m support (fix1p...)
    consolidation: true,                                 // Enable UTXO consolidation
    emailLogin: true,                                    // Enable email/password wallet generation
    multiLanguage: true                                  // Enable multi-language support
  }
};


// ============================================================================================================
// UTILITY FUNCTIONS - DO NOT MODIFY
// ============================================================================================================

export function replacePlaceholders(text) {
  if (!text) return text;
  return text
    .replace(/\{BLOCKCHAIN_NAME\}/g, BLOCKCHAIN_CONFIG.NAME)
    .replace(/\{blockchain_name\}/g, BLOCKCHAIN_CONFIG.NAME_LOWER)
    .replace(/\{BLOCKCHAIN_FULL\}/g, BLOCKCHAIN_CONFIG.NAME_FULL)
    .replace(/\{SYMBOL\}/g, BLOCKCHAIN_CONFIG.UNITS.symbol);
}

export function getBlockchainName() {
  return BLOCKCHAIN_CONFIG.NAME;
}

export function getBlockchainSymbol() {
  return BLOCKCHAIN_CONFIG.UNITS.symbol;
}

export function getLegacyNetworkConfig() {
  return BLOCKCHAIN_CONFIG.NETWORK;
}

export function getValidationPatterns() {
  return BLOCKCHAIN_CONFIG.VALIDATION;
}

export function getHDConfig() {
  return {
    DERIVATION_PATHS: BLOCKCHAIN_CONFIG.HD_PATHS,
    START_RANGE: BLOCKCHAIN_CONFIG.HD_CONFIG.startRange,
    MAX_RANGE: BLOCKCHAIN_CONFIG.HD_CONFIG.maxRange,
    RANGE_SAFETY: BLOCKCHAIN_CONFIG.HD_CONFIG.rangeSafety,
    SCAN_CHUNK: BLOCKCHAIN_CONFIG.HD_CONFIG.scanChunk,
    SCAN_MAX_CHUNKS: BLOCKCHAIN_CONFIG.HD_CONFIG.scanMaxChunks,
    DEFAULT_WORD_COUNT: BLOCKCHAIN_CONFIG.HD_CONFIG.defaultWordCount
  };
}

export function getTransactionConfig() {
  return {
    MIN_FEE_RATE: BLOCKCHAIN_CONFIG.TRANSACTION.minFeeRate,
    DYNAMIC_FEE_RATE: BLOCKCHAIN_CONFIG.TRANSACTION.dynamicFeeRate,
    MAX_UTXOS_PER_BATCH: BLOCKCHAIN_CONFIG.TRANSACTION.maxUtxosPerBatch,
    MAX_TX_VBYTES: BLOCKCHAIN_CONFIG.TRANSACTION.maxTxVbytes,
    DUST_AMOUNT: BLOCKCHAIN_CONFIG.TRANSACTION.dustAmounts,
    MIN_CONSOLIDATION_FEE: BLOCKCHAIN_CONFIG.TRANSACTION.minConsolidationFee,
    DUST_RELAY_AMOUNT: BLOCKCHAIN_CONFIG.TRANSACTION.dustRelayAmount
  };
}

if (typeof window !== 'undefined') {
  window.BLOCKCHAIN_CONFIG = BLOCKCHAIN_CONFIG;
  window.getBlockchainName = getBlockchainName;
  window.getBlockchainSymbol = getBlockchainSymbol;
  window.replacePlaceholders = replacePlaceholders;
}

console.log(`Blockchain Config loaded: ${BLOCKCHAIN_CONFIG.NAME_FULL} v${BLOCKCHAIN_CONFIG.FOOTER.version}`);