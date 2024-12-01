// affiche les favoris de l'utilisateur connecté (personnages dans un div, comics dans une autre)

// packages
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";
import marvelGif from "../assets/gifs/marvel-final.gif";
import deadpoolGif from "../assets/gifs/deadpool.gif";

// Icons
import { FaStar } from "react-icons/fa";

const Favorites = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesData, setFavoritesData] = useState([]);

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/favorites`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          setFavoritesData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des favoris :", error);
        }
      };
      fetchFavorites();
    }
  }, [token]);

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <div className="gif">
            <img src={marvelGif} alt="gif-marvel" />
          </div>
        </div>
      ) : (
        <div className="favorites-container">
          <div className="title">
            <h1>Favoris</h1>
          </div>
          <div className="favorites-content">
            <div className="favorites-characters">
              <h2>Personnages</h2>
              <div className="favorites-cards">
                {favoritesData.filter(
                  (favorite) => favorite.type === "character"
                ).length > 0 ? (
                  favoritesData
                    .filter((favorite) => favorite.type === "character")
                    .map((favorite) => {
                      return (
                        <React.Fragment key={favorite._id}>
                          <div className="character-card">
                            {favorite.type === "character" && (
                              <>
                                <div className="character-favorite">
                                  <FaStar
                                    className="favorite-icon"
                                    onClick={async () => {
                                      if (token) {
                                        try {
                                          const responseDeleted =
                                            await axios.post(
                                              `${
                                                import.meta.env.VITE_API_URL
                                              }/favorites`,
                                              favorite.body,
                                              {
                                                headers: {
                                                  authorization: `Bearer ${token}`,
                                                },
                                              }
                                            );

                                          if (responseDeleted.status === 200) {
                                            setFavoritesData((prevData) =>
                                              prevData.filter(
                                                (fav) =>
                                                  fav._id !== favorite._id
                                              )
                                            );
                                          }
                                        } catch (error) {
                                          console.log(error.response);
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {favorite.body.thumbnail.path ===
                                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                                favorite.body.thumbnail.path ===
                                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                                  <img
                                    src={deadpoolSorry}
                                    alt="deadpool-sorry"
                                  />
                                ) : (
                                  <img
                                    src={
                                      favorite.body.thumbnail.path +
                                      "." +
                                      favorite.body.thumbnail.extension
                                    }
                                    alt="character-image"
                                  />
                                )}
                                <div className="character-infos">
                                  <h2>{favorite.body.name}</h2>
                                  {favorite.body.description && (
                                    <p>{favorite.body.description}</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })
                ) : (
                  <>
                    <img
                      src={deadpoolGif}
                      alt="deadpool-gif"
                      className="deadpool-gif"
                    />
                    <p className="text-no-fav">
                      Pas de personnages favoris ? Vraiment ?
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="favorites-comics">
              <h2>Comics</h2>
              <div className="favorites-cards">
                {favoritesData.filter((favorite) => favorite.type === "comic")
                  .length > 0 ? (
                  favoritesData
                    .filter((favorite) => favorite.type === "comic")
                    .map((favorite) => {
                      return (
                        <React.Fragment key={favorite._id}>
                          <div className="comic-card">
                            {favorite.type === "comic" && (
                              <>
                                <div className="character-favorite">
                                  <FaStar
                                    className="favorite-icon-comic"
                                    onClick={async () => {
                                      if (token) {
                                        try {
                                          const responseDeleted =
                                            await axios.post(
                                              `${
                                                import.meta.env.VITE_API_URL
                                              }/favorites`,
                                              favorite.body,
                                              {
                                                headers: {
                                                  authorization: `Bearer ${token}`,
                                                },
                                              }
                                            );

                                          if (responseDeleted.status === 200) {
                                            setFavoritesData((prevData) =>
                                              prevData.filter(
                                                (fav) =>
                                                  fav._id !== favorite._id
                                              )
                                            );
                                          }
                                        } catch (error) {
                                          console.log(error.response);
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {favorite.body.thumbnail.path ===
                                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                                favorite.body.thumbnail.path ===
                                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                                  <img
                                    src={deadpoolSorry}
                                    alt="deadpool-sorry"
                                  />
                                ) : (
                                  <img
                                    src={
                                      favorite.body.thumbnail.path +
                                      "." +
                                      favorite.body.thumbnail.extension
                                    }
                                    alt="comic-image"
                                  />
                                )}
                                <div className="comic-infos">
                                  <h2>{favorite.body.title}</h2>
                                  {favorite.body.description && (
                                    <p>{favorite.body.description}</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })
                ) : (
                  <>
                    <img
                      src={deadpoolGif}
                      alt="deadpool-gif"
                      className="deadpool-gif"
                    />
                    <p className="text-no-fav">
                      Pas de comics favoris ? Vraiment ?
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Favorites;
