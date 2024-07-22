import { createBrowserRouter } from 'react-router-dom';
import Translation from '../components/Translation';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Translation />,
  },
]);
