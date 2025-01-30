import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import Home from './pages/Home'; // Your homepage component
import MovieDetails from './pages/MovieDetails'; // Your movie details component
import Header from './component/Header';
import Footer from './component/Footer';
import AboutPage from './pages/About';
import TopRatedMovies from './pages/TopRated';
import SearchPage from './pages/SearchPage';
import Register from './pages/Registration';
import Login from './pages/LoginPage';
import UserProfile from './pages/UserProfile';


function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} /> {/* Dynamic route */}
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/top-rated' element={<TopRatedMovies/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<UserProfile/>}/>




      </Routes>
      <Footer/>
    </Router>
    </ApolloProvider>
  );
}

export default App;
