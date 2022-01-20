import React, { useState } from "react";
import { scanner } from "scanner-js";

const Scanner = () => {
  const [imagesScanned, setImagesScanned] = useState([]);

  /**scan request sent along with displayImagesoNpage function */
  const scanToPdfWithThumbnails = () => {
    window.scanner.scan(displayImagesOnPage, {
      output_settings: [
        {
          type: "return-base64",
          format: "pdf",
        },
        {
          type: "return-base64-thumbnail",
          format: "jpg",
          thumbnail_height: 200,
        },
      ],
    });
  };

  /** Processes the scan result */
  const displayImagesOnPage = (successful, mesg, response) => {
    if (!successful) {
      // On error
      console.error("Failed: " + mesg);
      return;
    }

    if (
      successful &&
      mesg != null &&
      mesg.toLowerCase().indexOf("user cancel") >= 0
    ) {
      // User cancelled.
      console.info("User cancelled");
      return;
    }

    let scannedImages = window.scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
    for (
      let i = 0;
      scannedImages instanceof Array && i < scannedImages.length;
      i++
    ) {
      let scannedImage = scannedImages[i];
      processOriginal(scannedImage);
    }

    let thumbnails = window.scanner.getScannedImages(response, false, true); // returns an array of ScannedImage for the thumbnails, just for showing
    for (let i = 0; thumbnails instanceof Array && i < thumbnails.length; i++) {
      let thumbnail = thumbnails[i];
      processThumbnail(thumbnail);
    }
  };

  const processThumbnail = (scannedImage) => {
    let elementImg = window.scanner.createDomElementFromModel({
      name: "img",
      attributes: {
        class: "scanned",
        src: scannedImage.src,
      },
    });
    document.getElementById("images").appendChild(elementImg);
  };
  const processOriginal = (scannedImage) => {
    let imgsScanned = imagesScanned;
    imgsScanned.push(scannedImage);
    setImagesScanned(imgsScanned);
    console.log(imagesScanned);
  };
  const onClick = () => {
    try {
      scanToPdfWithThumbnails();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Scanner.js TESTING</h2>
      <button type="button" onClick={() => onClick()}>
        Scan
      </button>
      <div id="images"></div>
    </div>
  );
};

export default Scanner;
