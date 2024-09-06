import { useState } from 'react';
import './App.css';
import Products from './routes/Products';
import Recipes from './routes/Recipes';
import Posts from './routes/Posts';

function App() {
  const [page, setPage] = useState(<Products />);

  return (
    <div className="container">
      <ul className='nav'>
        <li><a href="#" onClick={() => setPage(<Products />)}>Products</a></li>
        <li><a href="#" onClick={() => setPage(<Recipes />)}>Recipes</a></li>
        <li><a href="#" onClick={() => setPage(<Posts />)}>Posts</a></li>
      </ul>
      <hr />
      {page}
    </div>
  );
}

export default App;
