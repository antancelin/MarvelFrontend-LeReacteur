// comics liés au personnage sélectionné

// Packages
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// images
import deadpoolSorry from "../assets/imgs/deadpool-sorry.png";

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
        <p>En cours de chargement...</p>
      ) : (
        <>
          <div className="character-container">
            <div className="character-content">
              <div className="character-card">
                {characterData.thumbnail.path ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ? (
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
                <h2>{characterData.name}</h2>
                <p>{characterData.description}</p>
              </div>
              <div className="comics-list">
                {comicsData.comics.map((comic) => {
                  return (
                    <React.Fragment key={comicsData._id}>
                      <div className="comic-content">
                        <img
                          src={
                            comic.thumbnail.path +
                            "." +
                            comic.thumbnail.extension
                          }
                          alt="comic-cover"
                        />
                        <h2>{comic.title}</h2>
                        <p>{comic.description}</p>
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
