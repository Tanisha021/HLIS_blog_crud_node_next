const crypto = require("crypto");
const algorithm = 'AES-256-CBC';
const key = Buffer.from("4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147", 'hex');
const iv = Buffer.from("15a8f725eab7c3d34cc4e1a6e8aa1f9a", 'hex');

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const encrypted = encrypt(`
     {
  "title": "8th blog",
  "content": "This is the content of my 8th blog post."
}

`);
const decrypted = decrypt("d25602f05880682a2c35f85947d9c5a6aac68f62cef6f9ef2c6ac0db1e59b7450e2997e6fad7b63380a2c7a7ffd381639457c2a7a0b3e8c0c1626aa73988b30f1963943648e31aca0012598c4dcdf2a1222f2a71f1da868b893eacf6f4ea0dfd47a782db626dc9f6d45e9a0dff810b5a15bf171636321ddef0b7d585203d0c7de7711f0029e13877e61be2462ca88b18d758e5c086e7fed01343f23f62e2a3d92ed1bdb61dc49c8e5b159fdb0b17c812a994d46f2581f5e4a1b5f34d9ce986e754bb178acfdc2acc66876b8461f8aae6bbe4d72d7d7d213126d6677c7e4c1ecf21c56b2ebb0e4c921346b0a864a7b3b8e329b0c3a0775159db2758fbdc1f5060b82b16849dc8c6f0354ba4c9deba1d8ff3f54d7fb8eb068e7fda1f7ef9b5932412f4bf746550efb5a26dde047dbb5b3137fb39e92697d6671486e38989de481a260881ae7a0194dd2a3faaa2079266842c30d4a0ca4e1531cc6ce2d574eeaa5972dc9f37db25c7cdaa3c18fa4f98605e34dcbcb51a606fa155de4e6e1f4cc0bcd170de8a71306e417c5413644b071f697a109964d6533ec6814cb533e60aff1f");

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
