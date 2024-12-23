import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  User as FireUser,
  authState,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from '@angular/fire/auth';
import { LocalStorage } from '@burand/angular';
import { BehaviorSubject, first, lastValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CadastroForm } from '../interfaces/cadastro-form.interfece';
import { UpdateForms } from '../interfaces/update-form.interface';
import { Form } from '@angular/forms';
import { Recover } from '../interfaces/recover';
import { CartService } from './shoppingCart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private shoppingCartService: CartService
  ) {
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
      return true;
    } catch (err) {
      return false;
      console.error(err);
    }
  };

  async cad(form: CadastroForm): Promise<string> {
    try {
      const response = await lastValueFrom(
        this.http.post(`${environment.urlApi}/users`, form)
      );
      console.log(response);
      return 'success';
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return 'error';
    }
  }

  async update(form: UpdateForms, id: string) {
    const token = await this.getBearerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return lastValueFrom(
      this.http.put(`${environment.urlApi}/users/${id}`, form, { headers })
    );
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.shoppingCartService.clearCart();
    } catch (err) {
      console.error(err);
    }
  }

  initAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserSubject.next(user);
        if (typeof window !== 'undefined') {
          const { uid, email, displayName } = user;
          LocalStorage.setItem(
            'user',
            JSON.stringify({ uid, email, displayName })
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

  async recoverPass(email: string) {
    console.log('email:', email);
    const timestamp = Date.now();
    const code = btoa(email);
    const url = `http://localhost:4200/trocar-senha?code=${code}&time=${timestamp}`;
    try {
      const response = await lastValueFrom(
        this.http.post(`${environment.urlApi}/users/email`, { email, url })
      );
      console.log(response);
    } catch (error) {
      console.error('Erro ao enviar o email para o usuário:', error);
    }
  }

  async newPass(form: Recover) {
    console.log('form:', form);
    try {
      const response = await lastValueFrom(
        this.http.post(`${environment.urlApi}/users/pass`, form)
      );
      console.log(response);
    } catch (error) {
      console.error('Erro ao trocar a senha do usuário:', error);
    }
  }
}
