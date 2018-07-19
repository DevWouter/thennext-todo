import { NgModule } from "@angular/core";

// Routing module
import { SettingsRoutingModule } from "./settings.routing";

// Internal module
import { SettingsSharedModule } from "./shared/settings-shared.module";
import { SettingsPagesModule } from "./pages/settings-pages.module";

@NgModule({
  imports: [
    SettingsRoutingModule,
    SettingsSharedModule,
    SettingsPagesModule,
  ],
  declarations: [
  ],
  exports: []
})
export class SettingsModule { }
