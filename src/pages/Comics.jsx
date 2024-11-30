// affiche tous les comics en fonction des filtres & limites & pages

// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";

// Icons
import { CiSearch } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const Comics = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
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

    const fetchData = async () => {
      try {
        let filters = `?page=${page}`;
        if (title) {
          filters += `&title=${title}`;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics${filters}`
        );
        setData(response.data);
        setTotalPages(Math.ceil(response.data.count / response.data.limit));
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [title, page, token]);

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
        <div className="comics-container">
          <div className="comics-top">
            <div className="comics-searchbar">
              <CiSearch className="search-icon" />
              <input
                type="text"
                className="search-bar"
                placeholder="Recherche des comics"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </div>
            <div className="comics-pagination">
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
          <div className="comics-content">
            {data.results.map((comic) => {
              return (
                <React.Fragment key={comic._id}>
                  <div className="comic-card">
                    <div className="character-favorite">
                      {!favorites.includes(comic._id) ? (
                        <FaRegStar
                          onClick={async () => {
                            if (token) {
                              const newTab = [...favorites];
                              newTab.push(comic._id);
                              setFavorites(newTab);
                              try {
                                await axios.post(
                                  `${import.meta.env.VITE_API_URL}/favorites`,
                                  comic,
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
                          onClick={async () => {
                            if (token) {
                              const newTab = [...favorites];
                              const i = newTab.indexOf(comic._id);
                              if (i !== -1) {
                                newTab.splice(i, 1);
                                setFavorites(newTab);
                              }
                              try {
                                await axios.post(
                                  `${import.meta.env.VITE_API_URL}/favorites`,
                                  comic,
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
                    {comic.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                    comic.thumbnail.path ===
                      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                      <img src={deadpoolSorry} alt="deadpool-sorry" />
                    ) : (
                      <img
                        src={
                          comic.thumbnail.path +
                          "/portrait_incredible." +
                          comic.thumbnail.extension
                        }
                        alt="character-image"
                      />
                    )}
                    <h2>{comic.title}</h2>
                    <p>{comic.description}</p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="comics-pagination">
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

export default Comics;
