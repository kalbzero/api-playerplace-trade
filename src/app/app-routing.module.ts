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
  {
    path: 'recover',
    loadChildren: () => import('./pages/recover/recover.module').then( m => m.RecoverPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'trade',
    loadChildren: () => import('./pages/trade/trade.module').then( m => m.TradePageModule)
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then( m => m.ListsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
