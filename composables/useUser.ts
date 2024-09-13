import { useNuxtApp } from "#app";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
``;
import type { User } from "~/types/user";

const state = {
  user: ref<User | null>(),
};

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
          email: userSnapshot.data().email,
          first_name: userSnapshot.data().first_name,
          last_name: userSnapshot.data().last_name,
          created_at: userSnapshot.data().created_at,
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
