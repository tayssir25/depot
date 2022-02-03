import React, { useEffect, useState } from "react";
import { scanner } from "scanner-js";
import TextField from "@mui/material/TextField";
import { prominent } from "color.js";
import "./scanner.css";

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

  const displayScannedIMGS = (IMGS, id) =>{
    IMGS?.map((image)=> {
      let I =new Image();
      I.src= image?.src;
      document.getElementById(id).appendChild(I);
    })
  }
  useEffect(() => {
    /**use effect to render the final result
     * the returned array is to be mapped and manipulated
     */
    console.log("final result", f_result);
    displayScannedIMGS(f_result[0], 'input1');
    displayScannedIMGS(f_result[1], 'input2');
    displayScannedIMGS(f_result[2], 'input3');

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

  const renderInputs = () => {
    if (f_result.length){
        return(
          <div>
          <div>
            <TextField
              id="filePath"
              name="filePath"
              key={Math.random().toString()}
              label="Fichier "
              type="file"
              multiple
              variant="standard"
              value={''}
              fullWidth
            />
            <div id='input1'></div>
          </div>
          <div>
            <TextField
              id="filePath"
              name="filePath"
              key={Math.random().toString()}
              label="Fichier "
              type="file"
              multiple
              variant="standard"
              value={''}
              fullWidth
            />
            <div id='input2'></div>
          </div>
          <div>
            <TextField
              id="filePath"
              name="filePath"
              key={Math.random().toString()}
              label="Fichier "
              type="file"
              multiple
              variant="standard"
              value={''}
              fullWidth
            />
            <div id='input3'></div>
          </div>
        </div>
        );
    }

    return('');
  }
  return (
    <div>
      <h2>Scanner.js TESTING</h2>
      <button type="button" onClick={() => onClick()}>
        Scan
      </button>
      <div id="images">
       {renderInputs()}
      </div>
    </div>
  );
};

export default Scanner;
