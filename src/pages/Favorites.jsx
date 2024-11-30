// affiche les favoris de l'utilisateur connecté (personnages dans un div, comics dans une autre)

// packages
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";

// Icons
import { FaStar } from "react-icons/fa";

const Favorites = () => {
  const navigate = useNavigate();

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
        <p>Chargement en cours...</p>
      ) : (
        <div className="favorites-container">
          <div className="favorites-content">
            <div className="favorites-characters">
              <h2>CHARACTERS</h2>
              {favoritesData.map((favorite) => {
                return (
                  <React.Fragment key={favorite._id}>
                    <div className="favorite-card">
                      {favorite.type === "character" && (
                        <>
                          <FaStar
                            onClick={async () => {
                              if (token) {
                                try {
                                  const responseDeleted = await axios.post(
                                    `${import.meta.env.VITE_API_URL}/favorites`,
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
                                        (fav) => fav._id !== favorite._id
                                      )
                                    );
                                  }
                                } catch (error) {
                                  console.log(error.response);
                                }
                              }
                            }}
                          />
                          <div className="favorite-character">
                            <p>{favorite.body.name}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="favorites-comics">
              <h2>COMICS</h2>
              {favoritesData.map((favorite) => {
                return (
                  <React.Fragment key={favorite._id}>
                    <div className="favorite-card">
                      {favorite.type === "comic" && (
                        <>
                          <FaStar
                            onClick={async () => {
                              if (token) {
                                try {
                                  const responseDeleted = await axios.post(
                                    `${import.meta.env.VITE_API_URL}/favorites`,
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
                                        (fav) => fav._id !== favorite._id
                                      )
                                    );
                                  }
                                } catch (error) {
                                  console.log(error.response);
                                }
                              }
                            }}
                          />
                          <div className="favorite-comic">
                            <p>{favorite.body.title}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Favorites;
