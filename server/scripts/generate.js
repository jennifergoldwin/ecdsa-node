const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);

console.log("private key: " + toHex(privateKey) + "\n");
console.log("public key: " + toHex(publicKey).toString().slice(0, 20) + "\n");
console.log("public key: " + toHex(publicKey).toString() + "\n");
