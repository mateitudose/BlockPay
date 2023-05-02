const randomBytes = require('randombytes');
const crypto = require('crypto');
const bs58 = require('bs58');
const EC = require('elliptic').ec;
const bech32 = require('bech32').bech32;
const createHash = require('create-hash');

let id = randomBytes(32);
let privateKey = id;
let versionedKey = Buffer.concat([Buffer.from([0x00]), privateKey, Buffer.from([0x01])]); // Version should be 0x80 for Bitcoin

// Calculate the SHA-256 hash
let sha = crypto.createHash('sha256').update(versionedKey).digest();

// Calculate the SHA-256 hash of the hash
let shaOfSha = crypto.createHash('sha256').update(sha).digest();

// Take the first 4 bytes of the second SHA-256 hash, this is the checksum
let checksum = shaOfSha.slice(0, 4);

// Add the checksum at the end of the versioned private key
let binaryWIF = Buffer.concat([versionedKey, checksum]);

// Convert to Base58
let WIF = bs58.encode(binaryWIF);

let ec = new EC('secp256k1');

// Generate the public key from the private key
let keyPair = ec.keyFromPrivate(privateKey);
let publicKey = keyPair.getPublic(true, 'array'); // Compressed format

// Apply SHA-256
let sha2 = crypto.createHash('sha256').update(Buffer.from(publicKey)).digest();

// Apply RIPEMD-160
let ripemd160 = createHash('rmd160').update(sha2).digest();

// Convert the public key hash into a bech32 Bitcoin address
let words = bech32.toWords(ripemd160);
let bech32Address = bech32.encode('bc', words);

console.log(bech32Address, WIF);