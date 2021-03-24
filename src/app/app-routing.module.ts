import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AngularFireAuth } from '@angular/fire/auth';

// Send unauthorized users to login page
const redirectUnauthorizedToLogin = () => { redirectUnauthorizedTo(['']); };

// Logged Users -> home page
const redirectLoggedInToHome = () => { redirectLoggedInTo(['home']); };

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    // canActivate: [AngularFireAuth],
    // data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    // canActivate: [AngularFireAuth],
    // data: {authGuardPipe: redirectLoggedInToHome}
  },
  {  // https://www.youtube.com/watch?v=xNleEVG9_yA
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    // canActivate: [AngularFireAuth],
    // data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
