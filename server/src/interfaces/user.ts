interface CreateUserBody {
  name: string;
  email: string;
  userName: string;
  photoUrl: string | "" | null | undefined;
  firebaseId: string;  
}

interface updateUserBody {
  name?: string;
  username?: string;
  photoUrl?: string;
}

export { CreateUserBody, updateUserBody };