import React, { useContext } from "react";

import "../../styles/footer-styles/footer.scss";

import { ImageContext } from "../../ImageContext";
import { height } from "@mui/system";

const Footer = () => {
  function toBase64(arr) {
    arr = new Uint8Array(arr); //if it's an ArrayBuffer
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  }

  const allImages = useContext(ImageContext).filter(
    (value) =>
      value.image_id === "image_logo_BT" || value.image_id === "image_logo_BCR"
  );

  return (
    <div className="footer-section">
      <p> © 2021-2022, Doci Petru aka.Biore. All rights reserved.</p>

      <div>
        {allImages.map((value, index) => {
          return (
            <svg className="image" key={index}>
              <a
                href={
                  value.image_id === "image_logo_BT"
                    ? "https://www.bancatransilvania.ro/"
                    : "https://www.bcr.ro/ro/persoane-fizice"
                }
                target="_blank"
              >
                <image
                  className="img"
                  href={`data:image/svg+xml;base64, ${toBase64(
                    value.image_data.data
                  )}`}
                  // placeholder="image-tech"
                />
              </a>
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
