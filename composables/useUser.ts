import { useNuxtApp } from "#app";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { state } from "./user";

const initialized = computed(() => state.user.value != null);

export const useUser = () => {
  const { $auth, $db } = useNuxtApp();

  const fetchUserFromDB = async (uid: string) => {
    if (state.user.value) {
      return state.user.value;
    }

    try {
      const userDoc = doc($db, "users", uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        state.user.value = {
          id: userSnapshot.id,
          ...userSnapshot.data(),
        };
      } else {
        console.error(
          "Aucun document utilisateur trouvé dans la collection 'users'."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur dans Firestore :",
        error
      );
    }
  };

  const fetchUser = () => {
    if (initialized.value) {
      return;
    }

    onAuthStateChanged($auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserFromDB(firebaseUser.uid);
      } else if (!firebaseUser) {
        state.user.value = null;
      }
    });
  };

  if (state.user.value == null) {
    fetchUser();
  }

  return {
    user: state.user,
    fetchUser,
  };
};
