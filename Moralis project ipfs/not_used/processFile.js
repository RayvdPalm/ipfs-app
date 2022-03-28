// const crypto = require('crypto');
// const algorithm = 'aes-256-ctr';
// const ENCRYPTION_KEY = 'B@&Na=fXWs6ZdZxc9ZtuWx?+RLqu3bm7VpDE#Qf?PdzWVdp^Qx_nWzRRdHhaF&mrq3WsxCt=*mqPCv&fncs^x7RSRpUcC^C=Zcy$w!u8X%bsh9n%t5=J8cB!_Ru%te4f+ux$7Bzmp!P6JuRg@qC@nncb3zMY8Bp&7?V%QX=P*2jQeApsr*?wEnYm2!gkV5wPcLBrPY&-6_VtE^JJ^@3&HZhP*z&yR-h2Qys-&gTZb@uMLaC#yLeu4q4t3X+_%3*n'; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
// const IV_LENGTH = 16;

// function encrypt(text) {
//     let iv = crypto.randomBytes(IV_LENGTH);
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }

// AES RFC - https://tools.ietf.org/html/rfc3602
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// generate key with crypto.randomBytes(256/8).toString('hex')
const key = '6d858102402dbbeb0f9bb711e3d13a1229684792db4940db0d0e71c08ca602e1';
const IV_LENGTH = 16;

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (text) => {
  const [iv, encryptedText] = text.split(':').map(part => Buffer.from(part, 'hex'));
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;