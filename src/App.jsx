import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

//HomePage imports
import HomePageLayout from './layouts/HomePageLayout';
import HomePage from './pages/HomePage';
//JamMate imports
import JamMateMain from './layouts/JamMateMain';
import JamMateExtra from './layouts/JamMateExtra';
import JamMateHomePage from './pages/JamMateHomePage';
import JamMateHostGame from './pages/JamMateHostGame';
import JamMateJoinGame from './pages/JamMateJoinGame';
import JamMateHowTo from './pages/JamMateHowTo';
import JamMateAbout from './pages/JamMateAbout';
import Nowhere from './pages/Nowhere';
//Other page imports
import CorkboardLayout from './layouts/CorkboardLayout';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Resume from './pages/Resume';




const router = createBrowserRouter(
  createRoutesFromElements(
    

    <>
    <Route path='/' element={<HomePageLayout/>}>
      <Route index element={<HomePage/>}/>
    </Route>
    <Route element={<CorkboardLayout/>}>
      <Route path='/Portfolio' element={<Portfolio/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/Resume' element={<Resume/>}/>
    </Route>
    <Route path='/JamMate' element={<JamMateExtra/>}>
      <Route index element={<JamMateHomePage/>} />
    </Route>
    <Route element={<JamMateMain/>}>
      <Route path='/JamMate/HostGame' element={<JamMateHostGame/>} />
      <Route path='/JamMate/JoinGame' element={<JamMateJoinGame/>} />
      <Route path='/JamMate/HowTo' element={<JamMateHowTo/>} />
      <Route path='/JamMate/About' element={<JamMateAbout/>} />
      <Route path='*' element={<Nowhere/>} />
    </Route>
    </>
  )
);

const App = () => {



  return <RouterProvider router={router} />;
};

export default App;