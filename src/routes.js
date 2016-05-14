import AppComponent from './components/app';
import IndexComponent from './components/site/index';
import RegisterComponent from './components/site/register';
import ProfileComponent from './components/site/profile';
import ActivationComponent from './components/site/activation';
import SignInComponent from './components/site/signin';
import Page from './components/page/Page';

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
      path: '/activation/:token',
      component: ActivationComponent
    },
    {
      path: '/page/:nameslug',
      component: Page
    }
  ]
};

export { routes };
