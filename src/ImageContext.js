import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const fetch = async () => {
      try {
        const allImages = await axios.get(
          `https://cardify-app-host.herokuapp.com/getAllImages`
        );

        await axios
          .all([allImages])
          .then(
            axios.spread((...responses) => {
              const allImages = responses[0].data;

              //   console.log(responses);
              setImages(allImages);
            })
          )
          .catch((errors) => {
            console.log(errors);
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();

    return () => {
      abortController.abort();
    };
  }, []);

  //console.log(images);

  return (
    <ImageContext.Provider value={images}>
      {props.children}
    </ImageContext.Provider>
  );
};
