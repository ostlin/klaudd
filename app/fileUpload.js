function handleFileSelect(evt) { 
    files = evt.files; // FileList object 

    console.log("\n============ Uploading file with the SYNC API ============"); 

    try { 
      var uploadedFile = Backendless.Files.upload( files, '/myFiles'); 
      console.log( "Uploaded file URL - " + uploadedFile.fileURL); 
    } catch(e) { 
      console.log(e); 
    } 
}