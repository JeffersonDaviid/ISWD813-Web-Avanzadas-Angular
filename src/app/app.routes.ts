import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Acerca } from './components/acerca/acerca';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'acerca',
    component: Acerca,
  },
];
