import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "tasks", component: TaskPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
