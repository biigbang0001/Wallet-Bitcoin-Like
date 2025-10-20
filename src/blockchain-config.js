// ============================================================================================================
// BLOCKCHAIN CONFIGURATION FILE
// ============================================================================================================
// This is the ONLY file you need to modify to adapt this wallet to any Bitcoin-like blockchain
// All other files automatically use these values
// ============================================================================================================

export const BLOCKCHAIN_CONFIG = {

  // ==========================================================================================================
  // SECTION 1: CRITICAL BLOCKCHAIN IDENTITY
  // ==========================================================================================================
  // These values define your blockchain's name and visual identity throughout the entire wallet
  
  NAME: 'BC2',                           // Short name (displayed everywhere: BTC, LTC, DOGE, etc.)
  NAME_LOWER: 'bc2',                     // Lowercase version (used for localStorage keys, etc.)
  NAME_FULL: 'BC2 Network',              // Full name (displayed in headers and titles)
  
  LOGO_PATH: './bc2.png',                // Path to your blockchain logo (256x256px recommended)
  FAVICON_PATH: './bc2.png',             // Path to favicon (same as logo is fine)
  
  
  // ==========================================================================================================
  // SECTION 2: CRITICAL NETWORK PARAMETERS
  // ==========================================================================================================
  // These are the MOST IMPORTANT values - they define how addresses are generated
  // Wrong values = wrong addresses = lost funds!
  
  NETWORK: {
    messagePrefix: '\x18BC2 Signed Message:\n',    // Message signing prefix
    
    bech32: 'bc',                                   // Bech32 address prefix
                                                    // Bitcoin: 'bc' (bc1...)
                                                    // Litecoin: 'ltc' (ltc1...)
                                                    // Dogecoin: 'doge' (doge1...)
                                                    // Testnet BTC: 'tb' (tb1...)
    
    pubKeyHash: 0x00,                               // Legacy address version byte (P2PKH)
                                                    // Bitcoin: 0x00 (addresses start with 1)
                                                    // Litecoin: 0x30 (addresses start with L)
                                                    // Dogecoin: 0x1E (addresses start with D)
                                                    // Testnet BTC: 0x6F (addresses start with m/n)
    
    scriptHash: 0x05,                               // P2SH address version byte
                                                    // Bitcoin: 0x05 (addresses start with 3)
                                                    // Litecoin: 0x32 (addresses start with M)
                                                    // Dogecoin: 0x16
                                                    // Testnet BTC: 0xC4 (addresses start with 2)
    
    wif: 0x80,                                      // WIF private key version byte
                                                    // Bitcoin: 0x80
                                                    // Litecoin: 0xB0
                                                    // Dogecoin: 0x9E
                                                    // Testnet BTC: 0xEF
    
    bip32: {
      public: 0x0488B21E,                           // Extended public key version (xpub)
                                                    // Bitcoin mainnet: 0x0488B21E
                                                    // Litecoin: 0x019DA462
                                                    // Dogecoin: 0x02FACAFD
                                                    // Testnet: 0x043587CF
      
      private: 0x0488ADE4                           // Extended private key version (xprv)
                                                    // Bitcoin mainnet: 0x0488ADE4
                                                    // Litecoin: 0x019D9CFE
                                                    // Dogecoin: 0x02FAC398
                                                    // Testnet: 0x04358394
    }
  },
  
  
  // ==========================================================================================================
  // SECTION 3: BIP44 HD WALLET DERIVATION PATHS
  // ==========================================================================================================
  // Format: m/purpose'/coin_type'/account'/change/address_index
  // The coin_type is the CRITICAL value that must match your blockchain
  // See: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  
  HD_PATHS: {
    legacy: "m/44'/0'/0'",                          // BIP44 - Legacy P2PKH addresses
                                                    // Bitcoin: "m/44'/0'/0'"
                                                    // Litecoin: "m/44'/2'/0'"
                                                    // Dogecoin: "m/44'/3'/0'"
                                                    // Dash: "m/44'/5'/0'"
                                                    // Testnet: "m/44'/1'/0'"
    
    p2sh: "m/49'/0'/0'",                            // BIP49 - P2SH-wrapped SegWit
    bech32: "m/84'/0'/0'",                          // BIP84 - Native SegWit
    taproot: "m/86'/0'/0'"                          // BIP86 - Taproot
  },
  
  
  // ==========================================================================================================
  // SECTION 4: RPC NODES CONFIGURATION
  // ==========================================================================================================
  // Your wallet will connect to these nodes to interact with the blockchain
  // Automatic failover if primary node is down
  
  RPC_NODES: [
    {
      url: '/api/',                                 // Primary RPC endpoint (proxied through Nginx)
      priority: 1,                                  // Lower number = higher priority
      timeout: 2000                                 // Request timeout in milliseconds
    },
    {
      url: '/api-custom/',                          // Backup RPC endpoint
      priority: 2,
      timeout: 2000
    }
  ],
  
  
  // ==========================================================================================================
  // SECTION 5: BLOCKCHAIN EXPLORERS
  // ==========================================================================================================
  // Used to generate links to view transactions and addresses
  
  EXPLORERS: {
    primary: '/explorer',                           // Primary block explorer URL
    fallback: '/explorer',                          // Fallback explorer if primary fails
    txPath: '/tx/',                                 // Path format for transactions
    addressPath: '/address/'                        // Path format for addresses
  },
  
  
  // ==========================================================================================================
  // SECTION 6: TRANSACTION PARAMETERS
  // ==========================================================================================================
  // Fee rates are fetched dynamically from the network, these are fallback minimums
  
  TRANSACTION: {
    minFeeRate: 0.00001,                            // Minimum fee rate in BTC/kB (fallback if network query fails)
                                                    // Bitcoin: 0.00001
                                                    // Litecoin: 0.00001
                                                    // Dogecoin: 0.01 (much higher!)
    
    dynamicFeeRate: 0.00001,                        // Dynamic fee rate (fetched from network)
    
    maxUtxosPerBatch: 100,                          // Maximum UTXOs per consolidation batch
    maxTxVbytes: 99000,                             // Maximum transaction size in virtual bytes
    
    dustAmounts: {                                  // Dust limits per address type (in satoshis)
      p2pkh: 546,                                   // Legacy
      p2wpkh: 294,                                  // Native SegWit
      p2sh: 540,                                    // P2SH-wrapped SegWit
      p2tr: 330                                     // Taproot
    },
    
    minConsolidationFee: 0.00005,                   // Minimum fee for consolidation transactions
    dustRelayAmount: 3000                           // Standard dust relay amount
  },
  
  
  // ==========================================================================================================
  // SECTION 7: DISPLAY UNITS
  // ==========================================================================================================
  
  UNITS: {
    symbol: 'BC2',                                  // Currency symbol displayed everywhere
    decimals: 8,                                    // Number of decimal places (usually 8)
    satoshiName: 'satoshi'                          // Name of smallest unit
  },
  
  
  // ==========================================================================================================
  // SECTION 8: UTXO VALUE THRESHOLDS
  // ==========================================================================================================
  // These values determine which UTXOs can be used in different contexts
  
  UTXO_VALUES: {
    minTransaction: 777,                            // Minimum UTXO value for normal transactions (satoshis)
    dustRelay: 3000,                                // Standard dust relay threshold (satoshis)
    minConsolidation: 546                           // Minimum UTXO value for consolidation (satoshis)
  },
  
  
  // ==========================================================================================================
  // SECTION 9: HD WALLET SCANNING CONFIGURATION
  // ==========================================================================================================
  // These parameters control how the wallet scans for HD wallet addresses
  
  HD_CONFIG: {
    startRange: 512,                                // Initial range for descriptor-based scanning
    maxRange: 50000,                                // Maximum addresses to scan
    rangeSafety: 16,                                // Safety margin for address gap
    scanChunk: 50,                                  // Addresses per scan chunk
    scanMaxChunks: 40,                              // Maximum number of chunks to scan
    defaultWordCount: 12                            // Default mnemonic length (12 or 24)
  },
  
  
  // ==========================================================================================================
  // SECTION 10: ADDRESS VALIDATION PATTERNS
  // ==========================================================================================================
  // Regular expressions for validating different address formats
  
  VALIDATION: {
    bech32Address: /^bc1[02-9ac-hj-np-z]{6,87}$/,          // Native SegWit (Bech32)
    bech32mAddress: /^bc1p[02-9ac-hj-np-z]{6,87}$/,        // Taproot (Bech32m)
    legacyAddress: /^[13][1-9A-HJ-NP-Za-km-z]{25,39}$/,    // Legacy P2PKH/P2SH
    wif: /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/,             // WIF private key
    hexPrivateKey: /^[0-9a-fA-F]{64}$/,                    // Hex private key
    xprv: /^xprv[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/, // Extended private key
    scriptHex: /^[0-9a-fA-F]*$/,                           // Script hex
    txid: /^[0-9a-fA-F]{64}$/,                             // Transaction ID
    amount: /^\d+(\.\d{1,8})?$/,                           // Amount format
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/                    // Email format
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
    githubUrl: 'https://github.com/biigbang0001/wallet-bc2',
    officialSiteUrl: 'https://bitcoin-ii.org/',
    officialSiteText: 'bitcoin-ii.org 🚀',
    version: 'V3.0.0'
  },
  
  
  // ==========================================================================================================
  // SECTION 13: FEATURE FLAGS
  // ==========================================================================================================
  // Enable or disable specific features
  
  FEATURES: {
    hdWallet: true,                                 // Enable HD wallet support (mnemonic/xprv)
    taproot: true,                                  // Enable Taproot/Bech32m support
    consolidation: true,                            // Enable UTXO consolidation
    emailLogin: true,                               // Enable email/password wallet generation
    multiLanguage: true                             // Enable multi-language support
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