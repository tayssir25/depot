const OCR = require("../middleware/OCRSpace");

const parseFile = async (req, res, filePath) => {
    try {
      // const isCreateSearchablePdf = req.body.isCreateSearchablePdf;
      // const isSearchablePdfHideTextLayer = req.body.isSearchablePdfHideTextLayer;
      // const isTable = req.body.isTable;
      // const language = req.body.language;
      const isCreateSearchablePdf = false;
      const isSearchablePdfHideTextLayer = false;
      const isTable = true;
      const language = req.body.language;
      if (!filePath) {
        const FilePath = String(filePath);
        var result = await OCR(FilePath, {
          language,
          isCreateSearchablePdf,
          isSearchablePdfHideTextLayer,
          isTable,
        });
      } else
        var result = await OCR(filePath.path, {
          language,
          isCreateSearchablePdf,
          isSearchablePdfHideTextLayer,
          isTable,
        });
      return (result);
    } catch (err) {
      console.log("you have an error " + err);
      return (err);
    }
  };

const searchForSeparators = async (req, res) => {
    try {
        let filePath = req.file;
        const result =  await parseFile(req, res, filePath);
        console.log(result)
        res.json(result);
    } catch (err){
        res.send(err);
    }
};

module.exports = {
    searchForSeparators,
};