// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /RSC/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}

// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/docs/{documentId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}