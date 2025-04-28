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
    "title": "hhh ab hoja update Blog Title5",
    "content":"neh",
    "status": 1
}

`);
const decrypted = decrypt("d25602f05880682a2c35f85947d9c5a62027dcff8f179effbfff0e36f483349c440185a892a519ad4a432569e1a3b96714b537f378ed8c881f7b7551e17488c30754d3fa10dd854012ebf70edfb591db2ed30c82a510aaed878f76d11612099d183931f5a56836dd68ea72b6cec9c844cccaf0dd8dcf569bfd1ed48d49fe5910360998662e9d719c7db37c1ee41a936c");

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
