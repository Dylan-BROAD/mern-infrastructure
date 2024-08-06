import "./App.css";
import AuthPage from "../AuthPage/AuthPage";
import NotePage from "../NotePage/NotePage";
import NoteEditPage from "../NoteEditPage/NoteEditPage";
import NavBar from "../../components/NavBar/NavBar";
import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';

function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      { user ? <>
        <NavBar user={user} setUser={setUser}/>
        <Routes>
        <Route path="/notes" element={<NotePage user={user}  />} />
        <Route path="/note/:id" element={<NoteEditPage />} />
        </Routes>
        </>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );

}

export default App;