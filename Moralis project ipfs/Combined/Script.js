//alles bij elkaar

//automatic password generation
function generatePassword() {
    var length = 36,
        charset = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        password = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

//password wordt geplakt op de value plaats van txtencpassphrase's value

//encryption
async function encryptfile() {
    // commented niet meer nodig vanwege automatische invulling van wachtwoord
    // btnEncrypt.disabled=true;

    // var plaintextbytes=await readfile(objFile)
    // .catch(function(err){
    // 	console.error(err);
    // });	
    // var plaintextbytes=new Uint8Array(plaintextbytes);

    var password = generatePassword();

    console.log(password); //test of wachtwoord zelfde blijft

    var pbkdf2iterations=10000;
    var passphrasebytes=new TextEncoder("utf-8").encode(password);
    var pbkdf2salt=window.crypto.getRandomValues(new Uint8Array(8));

    console.log(password); //test of wachtwoord zelfde blijft

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
    .catch(function(err){
        console.error(err);
    });
    console.log('passphrasekey imported');

    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)		
    .catch(function(err){
        console.error(err);
    });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    keybytes=pbkdf2bytes.slice(0,32);
    ivbytes=pbkdf2bytes.slice(32);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['encrypt']) 
    .catch(function(err){
        console.error(err);
    });
    console.log('key imported');		

    var cipherbytes=await window.crypto.subtle.encrypt({name: "AES-CBC", iv: ivbytes}, key, plaintextbytes)
    .catch(function(err){
        console.error(err);
    });

    if(!cipherbytes) {
         spnEncstatus.classList.add("redspan");
        spnEncstatus.innerHTML='<p>Error encrypting file.  See console log.</p>';
        return;
    }

    console.log('plaintext encrypted');
    cipherbytes=new Uint8Array(cipherbytes);

    var resultbytes=new Uint8Array(cipherbytes.length+16)
    resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);

    var blob=new Blob([resultbytes], {type: 'application/download'});
    // var blobUrl=URL.createObjectURL(blob);
        return blob;
    // aEncsavefile.href=blobUrl;

    //  spnEncstatus.classList.add("greenspan");
    // spnEncstatus.innerHTML='<p>File encrypted.</p>';
    // aEncsavefile.hidden=false;
}

//file upload to ipfs

//upload
uploadFile = async () => {

    var encryptedFile = encryptfile();

    const data = encryptedFile;
    const file = new Moralis.File(data.name, data)
    await file.saveIPFS();
    return file.ipfs()
  }
  
  //upload metadata object
  uploadMetadata = async (fileURL) =>{
    const metadata = {
    // optionele metadata, veroorzaakt meer clicks
    "description" : description,
    "file" : fileURL
    }
  
    const file = new Moralis.File("file.json", {base64 : btoa(JSON.stringify(metadata))});
    await file.saveIPFS();
  
    //Function for shareable link message
    Swal.fire({
    title: "<i>Filelink :</i>", 
    html: '<a href="'+ fileURL + '">' + fileURL + '</a>', 
    icon: 'success',  
    confirmButtonText: "<u>Sluiten</u>", 
    });
  }
  
  //function send
  send = async () => {
    const document = await uploadFile();
    await uploadMetadata(document);
  }