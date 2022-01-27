import React, { useEffect, useState } from "react";
import { scanner } from "scanner-js";
import { prominent } from "color.js";

const Scanner = () => {
  const [imagesScanned, setImagesScanned] = useState([]);
  const [result, setResult] = useState([]);
  const [f_result, setF_result] = useState([]);

  /**scan request sent along with displayImagesoNpage function */
  const scanToPdfWithThumbnails = () => {
    window.scanner.scan(displayImagesOnPage, {
      output_settings: [
        {
          type: "return-base64",
          format: "jpg",
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
      // if there's an error
      console.error("Failed: " + mesg);
      return;
    }
    if (
      successful &&
      mesg != null &&
      mesg.toLowerCase().indexOf("user cancel") >= 0
    ) {
      // if the user cancels wouthout saving the scanned documents
      console.info("User cancelled");
      return;
    }
    let scannedImages = window.scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
    setImagesScanned([...scannedImages]);
  };

  const getColor = (data, i, res) => {
    if (i < data.length) {
      prominent(data[i].src, { amount: 1 }).then((color) => {
        console.log(color); // [241, 221, 63]
        console.log(i);
        if (color.toString() === "20,200,120") {
          res.push(i);
        }

        let j = i + 1;

        getColor(data, j, res);
      });
    } else {
      // the end of the search
      setResult([...res]);
    }
  };

  useEffect(() => {
    // desconstruct images array
    let files = [];
    let bucket = [];
    for (let i = 0; i < imagesScanned.length; i++) {
      if (result.indexOf(i) !== -1) {
        // push to files array
        files.push(bucket);
        // flush array
        bucket = [];
      } else {
        bucket.push(imagesScanned[i]);
      }
    }
    if (bucket.length > 0) {
      files.push(bucket);
    }
    setF_result([...files]);
  }, [result]);

  useEffect(() => {
    console.log("final result", f_result);
  }, [f_result]);

  const separateImages = () => {
    getColor(imagesScanned, 0, []);
  };

  useEffect(() => {
    separateImages(imagesScanned);
  }, [imagesScanned]);
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
