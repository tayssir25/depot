import React from "react";
import {scanner} from 'scanner-js';

const Scanner = () => {
  const onClick = () => {
    try{
      scanAndUploadDirectly();
    } catch (err) {
      console.log(err);
    }
  }
  const displayServerResponse=(successful, mesg, response)=>{
    if(!successful) { // On error
        document.getElementById('server_response').innerHTML = 'Failed: ' + mesg;
        return;
    }
    if(successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
        document.getElementById('server_response').innerHTML = 'User cancelled';
        return;
    }
    document.getElementById('server_response').innerHTML = scanner.getUploadResponse(response);
}
const scanAndUploadDirectly= () => {
    window.scanner.scan(displayServerResponse,
        {
            "output_settings": [
                {
                    "type": "upload",
                    "format": "pdf",
                    "upload_target": {
                        "url": "https://asprise.com/scan/applet/upload.php?action=dump",
                        "post_fields": {
                            "sample-field": "Test scan"
                        },
                        "cookies": document.cookie,
                        "headers": [
                            "Referer: " + window.location.href,
                            "User-Agent: " + navigator.userAgent
                        ]
                    }
                }
            ]
        }
    );
}
    return (
      <div>
        {/* <h2>Scanner.js TEST</h2>
        <button type="button" onClick={()=>scan()}>
          Scan
        </button>
        <div id="images"></div>
      </div> */}
      <h2>Scanner.js: Scan and Upload Directly</h2>
    <button type="button" onClick={()=>onClick()}>Scan and Upload</button>
    <div id="server_response"></div>
    </div>
    );
  };

  export default Scanner;