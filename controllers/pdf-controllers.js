const pdf = require("html-pdf");
const pdfTemplate = require("../documents");

const createPdf = (req, res) => {
  pdf
    .create(pdfTemplate({ ...req.body, email: req.userData.email }))
    .toStream((err, pdfStream) => {
      if (err) {
        next(err);
      } else {
        res.statusCode = 200;
        // once done reading end the response
        pdfStream.on("end", () => {
          // done reading
          return res.end();
        });
        // pipe the contents of the PDF directly to the response
        pdfStream.pipe(res);
      }
    });
};

exports.createPdf = createPdf;
