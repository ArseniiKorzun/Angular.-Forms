import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface Hobby {
  name: string;
  checked: boolean;
}

interface Registration {
  login: string;
  password: string;
  gender: string;
  city: string;
  hobbies: string;
  about: string;
}

@Component({
  selector: 'app-registration-form',
  imports: [FormsModule],
  template: `
    <h2>1. Шаблонна форма реєстрації (валідація Angular)</h2>
    <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="form">
      <div class="row">
        <label for="login">Логін:</label>
        <div>
          <input id="login" name="login" [(ngModel)]="model.login" #login="ngModel" required minlength="3" maxlength="20" />
          @if (login.invalid && (login.touched || submitted())) {
            <small class="error">
              @if (login.errors?.['required']) { Логін є обов'язковим }
              @else if (login.errors?.['minlength']) { Мінімум 3 символи }
              @else { Максимум 20 символів }
            </small>
          }
        </div>
      </div>

      <div class="row">
        <label for="password">Пароль:</label>
        <div>
          <input id="password" name="password" type="password" [(ngModel)]="model.password" #password="ngModel" required minlength="6" />
          @if (password.invalid && (password.touched || submitted())) {
            <small class="error">
              @if (password.errors?.['required']) { Пароль є обов'язковим } @else { Мінімум 6 символів }
            </small>
          }
        </div>
      </div>

      <div class="row">
        <label for="password2">Пароль (ще раз):</label>
        <div>
          <input id="password2" name="password2" type="password" [(ngModel)]="model.password2" #password2="ngModel" required />
          @if ((password2.touched || submitted()) && (password2.errors?.['required'] || passwordsMismatch)) {
            <small class="error">
              @if (password2.errors?.['required']) { Повторіть пароль } @else { Паролі не збігаються }
            </small>
          }
        </div>
      </div>

      <div class="row">
        <span>Стать:</span>
        <div>
          <label><input type="radio" name="gender" value="чоловік" [(ngModel)]="model.gender" #gender="ngModel" required /> чоловік</label>
          <label><input type="radio" name="gender" value="жінка" [(ngModel)]="model.gender" /> жінка</label>
          @if (gender.invalid && submitted()) {
            <small class="error">Оберіть стать</small>
          }
        </div>
      </div>

      <div class="row">
        <label for="city">Місто:</label>
        <div>
          <select id="city" name="city" [(ngModel)]="model.city" #city="ngModel" required>
            <option value="">Оберіть місто</option>
            @for (c of cities; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
          @if (city.invalid && (city.touched || submitted())) {
            <small class="error">Оберіть місто</small>
          }
        </div>
      </div>

      <div class="row">
        <span>Улюблені ігри:</span>
        <div class="hobbies">
          @for (h of hobbies; track h.name) {
            <label><input type="checkbox" [name]="h.name" [(ngModel)]="h.checked" /> {{ h.name }}</label>
          }
        </div>
      </div>

      <div class="row">
        <label for="about">Про себе:</label>
        <div>
          <textarea id="about" name="about" rows="5" [(ngModel)]="model.about" #about="ngModel" maxlength="200"></textarea>
          @if (about.invalid && (about.touched || submitted())) {
            <small class="error">Максимум 200 символів</small>
          }
        </div>
      </div>

      <div class="row">
        <span></span>
        <div>
          <button type="submit">Зареєструватися</button>
        </div>
      </div>
    </form>

    @if (result(); as r) {
      <h3>Введені дані</h3>
      <table>
        <tr><th>Логін</th><td>{{ r.login }}</td></tr>
        <tr><th>Пароль</th><td>{{ r.password }}</td></tr>
        <tr><th>Стать</th><td>{{ r.gender }}</td></tr>
        <tr><th>Місто</th><td>{{ r.city }}</td></tr>
        <tr><th>Улюблені ігри</th><td>{{ r.hobbies }}</td></tr>
        <tr><th>Про себе</th><td>{{ r.about }}</td></tr>
      </table>
    }
  `,
  styles: `
    .form { display: grid; gap: 8px; max-width: 560px; }
    .row { display: grid; grid-template-columns: 170px 1fr; gap: 8px; align-items: start; }
    .row > input, .row > select, .row > textarea { width: 100%; box-sizing: border-box; }
    .hobbies { display: grid; gap: 4px; }
    .error { display: block; color: red; }
    table { border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #888; padding: 4px 10px; text-align: left; }
    th { background: #eee; }
  `,
})
export class RegistrationForm {
  protected readonly cities = ['Житомир', 'Київ', 'Львів', 'Одеса', 'Харків'];
  protected readonly hobbies: Hobby[] = [
    { name: 'футбол', checked: false },
    { name: 'баскетбол', checked: false },
    { name: 'волейбол', checked: false },
    { name: 'шахи', checked: false },
    { name: 'World of Tanks', checked: false },
  ];
  protected readonly model = { login: '', password: '', password2: '', gender: '', city: '', about: '' };
  protected readonly submitted = signal(false);
  protected readonly result = signal<Registration | null>(null);

  protected get passwordsMismatch(): boolean {
    return this.model.password !== this.model.password2;
  }

  protected onSubmit(form: NgForm): void {
    this.submitted.set(true);
    if (form.invalid || this.passwordsMismatch) {
      return;
    }
    this.result.set({
      login: this.model.login,
      password: '•'.repeat(this.model.password.length),
      gender: this.model.gender,
      city: this.model.city,
      hobbies: this.hobbies.filter((h) => h.checked).map((h) => h.name).join(', ') || 'не вибрано',
      about: this.model.about || '—',
    });
  }
}
