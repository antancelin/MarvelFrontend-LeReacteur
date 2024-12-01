// comics liés au personnage sélectionné

// Packages
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";
import marvelGif from "../assets/gifs/marvel-final.gif";

const Character = () => {
  const { id } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [comicsData, setComicsData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // requête pour récupérer les infos du personnages
        const characterResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/character/${id}`
        );
        // infos d'un personnage
        setCharacterData(characterResponse.data);

        // requête pour récupérer les comics
        const comicsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics/${id}`
        );
        // liste des comics
        setComicsData(comicsResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <div className="gif">
            <img src={marvelGif} alt="gif-marvel" />
          </div>
        </div>
      ) : (
        <>
          <div className="character-container">
            <div className="character-content">
              <div className="character-card">
                {characterData.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                characterData.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                  <img src={deadpoolSorry} alt="deadpool-sorry" />
                ) : (
                  <img
                    src={
                      characterData.thumbnail.path +
                      "." +
                      characterData.thumbnail.extension
                    }
                    alt="character-image"
                  />
                )}
                <div className="character-infos">
                  <h2>{characterData.name}</h2>
                  {characterData.description && (
                    <p>{characterData.description}</p>
                  )}
                </div>
              </div>
              <p>À retrouver ici ⬇️</p>
              <div className="comics-list">
                {comicsData.comics.map((comic) => {
                  return (
                    <React.Fragment key={comicsData._id}>
                      <div className="comic-card">
                        {comic.thumbnail.path ===
                          "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                        comic.thumbnail.path ===
                          "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708" ? (
                          <img src={deadpoolSorry} alt="deadpool-sorry" />
                        ) : (
                          <img
                            src={
                              comic.thumbnail.path +
                              "." +
                              comic.thumbnail.extension
                            }
                            alt="comic-image"
                          />
                        )}
                        <div className="comic-infos">
                          <h2>{comic.title}</h2>
                          {comic.description && <p>{comic.description}</p>}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Character;
