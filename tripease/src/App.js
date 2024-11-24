
import { BrowserRouter, Routes, Switch, Route, useNavigate } from "react-router-dom"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import SplitExpense from "./components/split-expense/SplitExpense"
import DocumentManagement from "./components/document-management/DocumentManagement"
import Weather from "./components/weather-info/Weather"
import Translator from './components/translator/Translator';
import Explore from "./components/Explore"
import Emergency from "./components/Emergency"
import globalRouter from './globalRouter'
import Navbar from "./components/navbar/Navbar";
import Trip1 from "./components/trip1/trip1"
import Hotel from "./pages/Hotel/Hotel";
import AboutUs from "./pages/Aboutus/Aboutus"
import Spot from "./components/spot/Spot";
import PublicRoute from './components/publicRoute';
import ProtectedRoute from './components/protectedRoute'
import { ThemeProvider } from './components/Themes/ThemeContext'
import Form from "./components/Form/Form"
function GlobleRouter() {
    const navigate = useNavigate();
    globalRouter.navigate = navigate;
}

function App() {
    return (
        <>
            <ThemeProvider>
                <BrowserRouter>
                    <GlobleRouter />
                    <Routes>
                        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route exact path="/split" element={<ProtectedRoute><SplitExpense /></ProtectedRoute>} />
                        <Route exact path="/doc" element={<ProtectedRoute><DocumentManagement /></ProtectedRoute>} />
                        <Route exact path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
                        <Route exact path="/translator" element={<ProtectedRoute><Translator /></ProtectedRoute>} />
                        <Route exact path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                        <Route exact path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
                        <Route exact path="/navbar" element={<ProtectedRoute><Navbar /></ProtectedRoute>} />
                        <Route exact path="/trip1" element={<ProtectedRoute><Trip1 /></ProtectedRoute>} />
                        <Route exact path="/hotel" element={<ProtectedRoute><Hotel /></ProtectedRoute>} />
                        <Route exact path="/spots" element={<ProtectedRoute><Spot /></ProtectedRoute>} />
                        <Route exact path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
                        <Route path="/feedback" element={<Form/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
