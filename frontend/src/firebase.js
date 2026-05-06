import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmFb3baN_26f4h1Sla5zchAuWiXH6UTuw",
  authDomain: "interior-design-platform-f1b22.firebaseapp.com",
  projectId: "interior-design-platform-f1b22",
  storageBucket: "interior-design-platform-f1b22.firebasestorage.app",
  messagingSenderId: "103262074531",
  appId: "1:103262074531:web:3f9dc3ab6eec517fa37116",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);