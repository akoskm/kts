import AppComponent from './components/app';
import IndexComponent from './components/index';
import RegisterComponent from './components/register';
import AboutComponent from './components/about';
import ProfileComponent from './components/profile';
import ActivationComponent from './components/activation';
import SignInComponent from './components/signin';

const routes = {
  path: '',
  component: AppComponent,
  childRoutes: [
    {
      path: '/',
      component: IndexComponent
    },
    {
      path: '/signup',
      component: RegisterComponent
    },
    {
      path: '/signin',
      component: SignInComponent
    },
    {
      path: '/profile',
      component: ProfileComponent
    },
    {
      path: '/about',
      component: AboutComponent
    },
    {
      path: '/activation/:token',
      component: ActivationComponent
    }
  ]
};

export { routes };
