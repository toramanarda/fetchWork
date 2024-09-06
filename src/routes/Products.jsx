import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function getData() {
    const fetchUrl = `https://dummyjson.com/products?delay=0&limit=100`;
    const data = await fetch(fetchUrl).then(res => res.json());
    setProducts(data.products);
    setFilteredProducts(data.products);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
    setPage(1);
  }, [searchQuery, products]);

  const pageCount = Math.ceil(filteredProducts.length / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if (page < pageCount) {
      setPage(page + 1);
    }
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function openModal(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="container">
        <div className="hero">
          <div className="header">
            <h1>Arda Toraman</h1>
            <div className="search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="product">
            {filteredProducts
              .slice((page - 1) * limit, page * limit)
              .map(x => (
                <div
                  className="productItem"
                  key={x.id}
                  onDoubleClick={() => openModal(x)}
                >
                  <h4>{x.title}</h4>
                  <img src={x.thumbnail} alt={x.title} />
                </div>
              ))
            }
          </div>
        </div>

        {pageCount > 1 && (
          <ul className="pagination">
            <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(num => (
              <li key={num}>
                <a
                  href="#"
                  className={page === num ? 'activePage' : ''}
                  onClick={e => { e.preventDefault(); setPage(num); }}
                >
                  {num}
                </a>
              </li>
            ))}
            <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
          </ul>
        )}
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            {selectedProduct && (
              <>
                <h2>{selectedProduct.title}</h2>
                <img src={selectedProduct.thumbnail} alt={selectedProduct.title} />
                <p>{selectedProduct.description}</p>
                <div className="modalNav">
                  <h5>{selectedProduct.category}</h5>
                  <h5>{selectedProduct.brand}</h5>
                  <h5>{selectedProduct.tags}</h5>
                </div>
                <div className="priceStcok">
                  <h5>{selectedProduct.price} $</h5>
                  <h5>Stock: {selectedProduct.stock}</h5>
                </div>
                <button onClick={closeModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
