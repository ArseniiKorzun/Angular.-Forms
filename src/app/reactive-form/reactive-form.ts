import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

const PASSWORD_RULES: Record<string, RegExp> = {
  'заголовну літеру': /\p{Lu}/u,
  'малу літеру': /\p{Ll}/u,
  'цифру': /\d/,
  'символ (@, #, _, +, -, *, &)': /[@#_+\-*&]/,
};

function passwordComplexity(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) {
    return null;
  }
  const missing = Object.keys(PASSWORD_RULES).filter((rule) => !PASSWORD_RULES[rule].test(value));
  return missing.length ? { passwordComplexity: { missing } } : null;
}

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule],
  template: `
    <h2>2. Реактивна форма з власним валідатором (складність пароля)</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
      @let login = form.controls.login;
      @let password = form.controls.password;

      <div class="row">
        <label for="rlogin">Логін:</label>
        <div>
          <input id="rlogin" formControlName="login" />
          @if (login.invalid && login.touched) {
            <small class="error">Логін є обов'язковим</small>
          }
        </div>
      </div>

      <div class="row">
        <label for="rpassword">Пароль:</label>
        <div>
          <input id="rpassword" type="password" formControlName="password" />
          @if (password.touched && password.errors?.['required']) {
            <small class="error">Пароль є обов'язковим</small>
          }
          @if (password.errors?.['passwordComplexity']; as e) {
            <small class="error">Пароль має містити: {{ e.missing.join(', ') }}</small>
          }
          @if (password.value) {
            <small>Складність: <b>{{ strength }}</b></small>
          }
        </div>
      </div>

      <div class="row">
        <span></span>
        <div>
          <button type="submit" [disabled]="form.invalid">Увійти</button>
        </div>
      </div>
    </form>

    @if (submitted()) {
      <p>Форму відправлено. Логін: <b>{{ form.controls.login.value }}</b>, складність пароля: <b>{{ strength }}</b></p>
    }
  `,
  styles: `
    .form { display: grid; gap: 8px; max-width: 560px; }
    .row { display: grid; grid-template-columns: 170px 1fr; gap: 8px; align-items: start; }
    .row > input { width: 100%; box-sizing: border-box; }
    .error { display: block; color: red; }
  `,
})
export class ReactiveForm {
  protected readonly form = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, passwordComplexity] }),
  });
  protected readonly submitted = signal(false);

  protected get strength(): string {
    const length = this.form.controls.password.value.length;
    return length >= 12 ? 'міцний' : length >= 8 ? 'середній' : 'легкий';
  }

  protected onSubmit(): void {
    this.submitted.set(this.form.valid);
  }
}
