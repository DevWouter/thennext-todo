import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountFormComponent } from "./create-account-form/create-account-form.component";
import { FormsModule } from "@angular/forms";
import { LoginFormComponent } from "./login-form/login-form.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    CreateAccountFormComponent,
    LoginFormComponent,
  ],
  exports: [
    CreateAccountFormComponent,
    LoginFormComponent,
  ]
})
export class AccountModule { }
