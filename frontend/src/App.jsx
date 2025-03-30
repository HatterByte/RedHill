import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom'
// import { connect } from "react-redux";
import HomePage from './pages/HomePage';
import { getUser } from './actions/auth.actions';

function App(props) {
  useEffect(() => {
    console.log("App mounted");
    getUser();
  }
  , []);

  return (
    <>
    <div className="h-screen w-screen bg-[url('https://railmadad.indianrailways.gov.in/madad/final/images/body-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed overflow-auto">

    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
    </div>
    
    </>
  )
}
// const mapStateToProps = (state) => {
//   // console.log(state);
//   return {
//     user: state.auth.user,
//   };
// };

export default App;
