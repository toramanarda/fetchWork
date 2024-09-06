import { useEffect, useRef, useState } from 'react';
import '../App.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchUrun, setSearchUrun] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 30;
  const skip = useRef(0);

  async function getData() {
    const data = await fetch(`https://dummyjson.com/recipes?limit=${limit}&skip=${skip.current}`)
      .then(res => res.json());
    setRecipes(data.recipes);
    setTotalPages(Math.ceil(data.total / limit));
    filterRecipes(data.recipes, searchUrun);
  }

  function filterRecipes(recipes, searchUrun) {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchUrun.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }

  function handlePageChange(newPage) {
    if (newPage > 0 && newPage <= totalPages) {
      skip.current = (newPage - 1) * limit;
      setPage(newPage);
      getData();
    }
  }

  function handleSearchChange(event) {
    const urun = event.target.value;
    setSearchUrun(urun);
    filterRecipes(recipes, urun);
  }

  function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
  }

  function handleCloseModal() {
    setSelectedRecipe(null);
  }

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <div className="container">
      <div className="header">
        <h1>Arda Toraman</h1>
        <div className="nav">
          <div className="search">
            <input
              type="text"
              placeholder="Ara"
              value={searchUrun}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <div className="product">
        {filteredRecipes.map(recipe => (
          <div
            className="productItem"
            key={recipe.id}
            onDoubleClick={() => handleRecipeClick(recipe)}
          >
            <h4>{recipe.name}</h4>
            <img src={recipe.image} alt={recipe.name} />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <ul className="pagination">
          <li><a href="#" onClick={() => handlePageChange(page - 1)}>&lt;</a></li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <li key={num}>
              <a
                href="#"
                className={page === num ? 'activePage' : ''}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </a>
            </li>
          ))}
          <li><a href="#" onClick={() => handlePageChange(page + 1)}>&gt;</a></li>
        </ul>
      )}
      {selectedRecipe && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>{selectedRecipe.name}</h2>
            <img className='recipesImg' src={selectedRecipe.image} alt={selectedRecipe.name} />
            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients}</p>
            <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
            <div className="recipesNav">
              <p><strong>PrepTimeMinutes:</strong> {selectedRecipe.prepTimeMinutes}</p>
              <p><strong>cookTimeMinutes:</strong> {selectedRecipe.cookTimeMinutes}</p>
              <p><strong>difficulty:</strong> {selectedRecipe.difficulty}</p>
              <p><strong>cuisine:</strong> {selectedRecipe.cuisine}</p>
              <p><strong>caloriesPerServing:</strong> {selectedRecipe.caloriesPerServing}</p>
              <p><strong>tags:</strong> {selectedRecipe.tags}</p>
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
