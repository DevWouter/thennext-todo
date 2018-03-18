import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountFormComponent } from "./create-account-form/create-account-form.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [CreateAccountFormComponent],
  exports: [CreateAccountFormComponent]
})
export class AccountModule { }
