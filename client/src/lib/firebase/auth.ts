import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebaseConfig";

export function onAuthStateChanged(cb: NextOrObserver<User>): () => void {
  return _onAuthStateChanged(auth, cb);
}

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredentials.user) {
      await updateProfile(userCredentials.user, {
        displayName: `${name}`,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=random`,
      });
      return userCredentials.user;
    } else {
      throw new Error("Current user is null");
    }
  } catch (err) {
    console.log("Error registering user");
    throw new Error("Current user is null");
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    if (user) {
      return user;
    } else {
      throw new Error("Current user is null");
    }
  } catch (e: any) {
    console.log(e);
    const errorCode = e.code;

    console.log(errorCode);
    if (errorCode === "auth/invalid-credential") {
      throw new Error("Invalid credentials!");
    } else if (errorCode === "auth/invalid-email") {
      throw new Error("Invalid email!");
    } else if (errorCode === "auth/missing-password") {
      throw new Error("Enter the password!");
    } else {
      throw new Error(`${errorCode}`);
    }
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  let user: any;
  try {
    await signInWithPopup(auth, provider).then((userCred) => {
      user = userCred.user;
    });
    if (user) {
      await updateProfile(user, {
        displayName: `${user.displayName}`,
        photoURL: `${user.photoURL}`,
      });
      return user;
    } else {
      throw new Error("Current user is null");
    }
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    return error;
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}
