import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './settings-page.component';
import { SettingsTasklistsComponent } from './tab-tasklists/tab-tasklists.component';
import { SettingsTabTagsComponent } from './tab-tags/tab-tags.component';
import { SettingsTabUrgencyComponent } from './tab-urgency/tab-urgency.component';
import { SettingsTasklistDetailComponent } from './tab-tasklists-detail/tab-tasklist-detail.component';
import { SettingsTabPersonalComponent } from './tab-personal/tab-personal.component';

const routes: Routes = [
  {
    path: 'settings', component: SettingsPageComponent,
    children: [
      { path: '', redirectTo: '/settings/(tab:personal)', pathMatch: "full" },
      { path: 'tasklists', component: SettingsTasklistsComponent, outlet: "tab" },
      { path: 'tasklists/:uuid', component: SettingsTasklistDetailComponent, outlet: "tab" },
      { path: 'tags', component: SettingsTabTagsComponent, outlet: "tab" },
      { path: 'urgency', component: SettingsTabUrgencyComponent, outlet: "tab" },
      { path: 'personal', component: SettingsTabPersonalComponent, outlet: "tab" },
    ]
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsPageRoutingModule { }
