import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import OnlyLayout from './layouts/OnlyLayout';
import ActuallyOneMore from './layouts/ActuallyOneMore';
import HomePage from './pages/HomePage';
import HostGame from './pages/HostGame';
import JoinGame from './pages/JoinGame';
import HowTo from './pages/HowTo';
import About from './pages/About';
import Nowhere from './pages/Nowhere';




const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<ActuallyOneMore/>}>
      <Route index element={<HomePage/>} />
    </Route>
    <Route element={<OnlyLayout/>}>
      <Route path='/HostGame' element={<HostGame/>} />
      <Route path='/JoinGame' element={<JoinGame/>} />
      <Route path='/HowTo' element={<HowTo/>} />
      <Route path='/About' element={<About/>} />
      <Route path='*' element={<Nowhere/>} />
    </Route>
    </>
  )
);

const App = () => {



  return <RouterProvider router={router} />;
};

export default App;