// affiche tous les personnages en fonction des filtres & limites & pages

// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";

// Icons
import { CiSearch } from "react-icons/ci";

const Characters = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let filters = `?page=${page}`;
        if (name) {
          filters += `&name=${name}`;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/characters${filters}`
        );
        setData(response.data);
        setTotalPages(Math.ceil(response.data.count / response.data.limit));
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [name, page]);

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const delta = 2; // Nombre de pages à afficher autour de la page active

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta) ||
        (currentPage <= 4 && i <= 5) ||
        (currentPage >= totalPages - 3 && i >= totalPages - 4)
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="characters-container">
          <div className="characters-top">
            <div className="characters-searchbar">
              <CiSearch className="search-icon" />
              <input
                type="text"
                className="search-bar"
                placeholder="Recherche des personnages"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div className="characters-pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                Précédent
              </button>
              {getPageNumbers(page, totalPages).map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span key={index}>...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageClick(pageNumber)}
                    className={page === pageNumber ? "active" : ""}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button onClick={handleNextPage} disabled={page === totalPages}>
                Suivant
              </button>
            </div>
          </div>
          <div className="characters-content">
            {data.results.map((character) => {
              return (
                <React.Fragment key={character._id}>
                  <div
                    className="character-card"
                    onClick={() => {
                      navigate(`/character/${character._id}`);
                    }}
                  >
                    {character.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                    character.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                      <img src={deadpoolSorry} alt="deadpool-sorry" />
                    ) : (
                      <img
                        src={
                          character.thumbnail.path +
                          "/portrait_incredible." +
                          character.thumbnail.extension
                        }
                        alt="character-image"
                      />
                    )}
                    <h2>{character.name}</h2>
                    {character.description && <p>{character.description}</p>}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="characters-pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Précédent
            </button>
            {getPageNumbers(page, totalPages).map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span key={index}>...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageClick(pageNumber)}
                  className={page === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </button>
              )
            )}
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Suivant
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Characters;
