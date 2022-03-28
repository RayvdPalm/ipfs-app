//Deze moet vervangen worden met de dropbox van encrypt.js
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};

dropContainer.ondrop = function(evt) {
// not compatible with IE :(
  fileInput.files = evt.dataTransfer.files;

const dT = new DataTransfer();
dT.items.add(evt.dataTransfer.files[0]);
dT.items.add(evt.dataTransfer.files[3]);
fileInput.files = dT.files;

evt.preventDefault();
};

// connect to Moralis server
const serverUrl = "https://rkrmvjgt02d8.usemoralis.com:2053/server";
const appId = "5DKM4WVSui4kf4BaTRzeqRroHnwROLb5VJXtVAda";
Moralis.start({ serverUrl, appId });

Moralis.authenticate({signingMessage:"Login succesful"})

//login
login = async () => {
  Moralis.Web3.authenticate().then(function (user){
  console.log('logged in');
})
}

//upload
uploadFile = async () => {
  const data = fileInput.files[0]
  const file = new Moralis.File(data.name, data)
  await file.saveIPFS();
  return file.ipfs()
}

//upload metadata object
uploadMetadata = async (fileURL) =>{
  const metadata = {
  // optionele metadata, veroorzaakt meer clicks
  // "name" : name,
  // "description" : description,
  "file" : fileURL
  }

  const file = new Moralis.File("file.json", {base64 : btoa(JSON.stringify(metadata))});
  await file.saveIPFS();

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


