import { Injectable } from '@angular/core';
import {
  Auth,
  User as FireUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  authState,
} from '@angular/fire/auth';
import { LocalStorage } from '@burand/angular';
import { BehaviorSubject, first, lastValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CadastroForm } from '../interfaces/cadastro-form.interfece';
import { UpdateForms } from '../interfaces/update-form.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private http: HttpClient) {
    const user = JSON.parse(LocalStorage.getItem('user'));
    if (user) {
      this.currentUserSubject.next(user);
      console.log(user);
    }
    this.initAuthListener();
  }

  signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.currentUserSubject.next(result.user);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  async cad(form: CadastroForm) {
    return lastValueFrom(this.http.post(`${environment.urlApi}/users`, form));
  }

  async update(form: UpdateForms) {
    return lastValueFrom(
      this.http.post(`${environment.urlApi}/users/:id`, form)
    );
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
    } catch (err) {
      console.error(err);
    }
  }

  initAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserSubject.next(user);
        if (typeof window !== 'undefined') {
          const { uid, email, displayName, photoURL } = user;
          LocalStorage.setItem(
            'user',
            JSON.stringify({ uid, email, displayName, photoURL })
          );
        }
      } else {
        this.currentUserSubject.next(null);
        LocalStorage.removeItem('user');
        console.log('Não está logado');
      }
    });
  }

  getUser() {
    return this.currentUserSubject.value;
  }

  async getBearerToken(): Promise<string> {
    const userLogged = await this.getFirebaseUser();
    if (userLogged) {
      return userLogged.getIdToken();
    } else {
      throw new Error('User is not authenticated.');
    }
  }

  getFirebaseUser(): Promise<FireUser | null> {
    return lastValueFrom(authState(this.auth).pipe(first()));
  }
}
