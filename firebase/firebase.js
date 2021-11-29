import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import firebaseConfig from './config';

class Firebase {
  constructor(){
    
    initializeApp(firebaseConfig);
    
    this.auth = getAuth();
  }

  //Registra un usuario
  async registrar(nombre,email,password){
    const nuevoUsuario = await createUserWithEmailAndPassword(this.auth,email,password);

    return await updateProfile(nuevoUsuario.user,{
      displayName: nombre
    })
  }

  //Inicia Sesion del usuario
  async login(email,password){
    return signInWithEmailAndPassword(this.auth,email,password);
  }

  //Cierra la sesion del usuario
  async cerrarSesion(){
    await signOut(this.auth);
  }
}

const firebase = new Firebase();

export default firebase;