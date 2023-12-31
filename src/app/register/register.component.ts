import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User, UserType, RegistrationObj } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hide = true;
  responseMsg: string = '';
  registerForm: FormGroup;


  registrationObj:RegistrationObj={
    id:0,
    firstName: '',
    lastName: '',
    email: '',
    userType: UserType.USER,
    mobile: '',
    password: '',
    blocked: false,
    active: false,
    createdOn: ''
  }

  public readonly backendService : string = 'http://localhost:4000/user/register'

  private httpClient: HttpClient
    

  constructor(private fb: FormBuilder, private api: ApiService,httpClient: HttpClient) {
    this.httpClient=httpClient
  
    this.registerForm = fb.group(
      {
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        rpassword: fb.control(''),
      },
      {
        validators: [repeatPasswordValidator],
      } as AbstractControlOptions
    );
  }

  register() {
    // let user: User = {
    //   id:0,
    //   firstName: this.registerForm.get('firstName')?.value,
    //   lastName: this.registerForm.get('lastName')?.value,
    //   email: this.registerForm.get('email')?.value,
    //   userType: UserType.USER,
    //   mobile: '',
    //   password: this.registerForm.get('password')?.value,
    //   blocked: false,
    //   active: false,
    //   createdOn: ''
    // };
    this.api.createAccount(this.registrationObj).subscribe({
      next: (res: any) => {
        console.log(res);
        this.responseMsg = res.toString();
        alert(res.toString());
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });

    // this.httpClient.post(this.backendService, this.registrationObj).subscribe(
    //   (data:any)=>{
    //     console.log(" Visitor Added/n----", data)
    //     this.responseMsg = data.toString();
    //     alert("Account Created Succcessfully");
    //   });
  
  }

  getFirstNameErrors() {
    if (this.FirstName.hasError('required')) return 'Field is requied!';
    return '';
  }
  getLastNameErrors() {
    if (this.LastName.hasError('required')) return 'Field is requied!';
    return '';
  }
  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Email is required!';
    if (this.Email.hasError('email')) return 'Email is invalid.';
    return '';
  }
  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Password is required!';
    if (this.Password.hasError('minlength'))
      return 'Minimum 8 characters are required!';
    if (this.Password.hasError('maxlength'))
      return 'Maximum 15 characters are required!';
    return '';
  }

  get FirstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl;
  }
  get LastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl;
  }
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get RPassword(): FormControl {
    return this.registerForm.get('rpassword') as FormControl;
  }
}

export const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('password')?.value;
  const rpwd = control.get('rpassword')?.value;
  if (pwd === rpwd) {
    control.get('rpassword')?.setErrors(null);
    return null;
  } else {
    control.get('rpassword')?.setErrors({ rpassword: true });
    return { rpassword: true };
  }
};
