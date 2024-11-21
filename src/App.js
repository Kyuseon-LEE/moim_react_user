import React from 'react';
import './App.css';
import './css/include.css';
import Header from './view/include/Header';
import MainImg from './view/include/MainImg';
import Article from './view/include/Article';
import Article2 from './view/include/Article2';

function App() {
  return (
    <div className="App">
      <Header />
      <MainImg />
      <Article />
      <Article2 />
    </div>
  );
}

export default App;
