module.exports = ({ name, content, email }) => {
  const today = new Date();
  return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .container {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .header {
               font-family: 'Arial',
             }
          </style>
       </head>
       <body>
          <div class="container">
             <h1 class="justify-center header">${name}</h1>
             <p class="justify-center">Email: ${email}</p>
             <div>${content}</div>
          </div>
       </body>
    </html>
    `;
};
