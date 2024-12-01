// affiche tous les personnages en fonction des filtres & limites & pages

// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";
import marvelGif from "../assets/gifs/marvel-final.gif";

// Icons
import { CiSearch } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const Characters = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      // affichage des favoris même après le reload de la page
      const fetchFavorites = async () => {
        try {
          const responseFavorites = await axios.get(
            `${import.meta.env.VITE_API_URL}/favorites`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const favoritesIds = responseFavorites.data.map((favorite) => {
            return favorite.body._id;
          });
          setFavorites(favoritesIds);
        } catch (error) {
          console.error("Erreur lors de la récupération des favoris :", error);
        }
      };
      fetchFavorites();
    }

    // affichage des personnages
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
  }, [name, page, token]);

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const delta = 2;

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
        <div className="loading">
          <div className="gif">
            <img src={marvelGif} alt="gif-marvel" />
          </div>
        </div>
      ) : (
        <div className="characters-container">
          <div className="title">
            <h1>Personnages</h1>
          </div>
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
                  <div className="character-card">
                    <div className="character-favorite">
                      {!favorites.includes(character._id) ? (
                        <FaRegStar
                          className="favorite-icon"
                          onClick={async () => {
                            if (token) {
                              const newTab = [...favorites];
                              newTab.push(character._id);
                              setFavorites(newTab);
                              try {
                                await axios.post(
                                  `${import.meta.env.VITE_API_URL}/favorites`,
                                  character,
                                  {
                                    headers: {
                                      authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                              } catch (error) {
                                console.log(error.response);
                              }
                            } else {
                              navigate("/login");
                            }
                          }}
                        />
                      ) : (
                        <FaStar
                          className="favorite-icon"
                          onClick={async () => {
                            if (token) {
                              const newTab = [...favorites];
                              const i = newTab.indexOf(character._id);
                              if (i !== -1) {
                                newTab.splice(i, 1);
                                setFavorites(newTab);
                              }
                              try {
                                await axios.post(
                                  `${import.meta.env.VITE_API_URL}/favorites`,
                                  character,
                                  {
                                    headers: {
                                      authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                              } catch (error) {
                                console.log(error.response);
                              }
                            }
                          }}
                        />
                      )}
                    </div>
                    {character.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                    character.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                      <img src={deadpoolSorry} alt="deadpool-sorry" />
                    ) : (
                      <img
                        src={
                          character.thumbnail.path +
                          "." +
                          character.thumbnail.extension
                        }
                        alt="character-image"
                      />
                    )}
                    <div
                      className="character-infos"
                      onClick={() => {
                        navigate(`/character/${character._id}`);
                      }}
                    >
                      <h2>{character.name}</h2>
                      {character.description && <p>{character.description}</p>}
                    </div>
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
