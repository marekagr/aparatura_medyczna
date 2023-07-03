import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layouts/components/main/main.component'
import { LoginComponent } from './components/auth/components/login/login.component'
// import { GlobalFormComponent } from './components/global/components/global-form/global-form.component'
// import { UserSettingsComponent } from './components/auth/components/user-settings/user-settings.component'

const routes: Routes = [ 
  {
  path: '',
  component :MainComponent,
  // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component :LoginComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
