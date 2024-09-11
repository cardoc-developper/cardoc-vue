import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyCE_EtgMUNbAxRjZ5hqHX6DYYez9qROU4A",
    authDomain: "cardoc-981e6.firebaseapp.com",
    projectId: "cardoc-981e6",
  };

  let firebaseApp;
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }

  const auth = getAuth(firebaseApp);
  console.log(auth);

  return {
    provide: {
      auth,
    },
  };
});
