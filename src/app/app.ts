import { Component } from '@angular/core';
import { RegistrationForm } from './registration-form/registration-form';
import { ReactiveForm } from './reactive-form/reactive-form';

@Component({
  selector: 'app-root',
  imports: [RegistrationForm, ReactiveForm],
  template: `
    <app-registration-form />
    <hr />
    <app-reactive-form />
  `,
})
export class App {}
