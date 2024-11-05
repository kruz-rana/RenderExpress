const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const sql = require('mysql2');
require('dotenv').config();

const db = sql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to db : ', err);
    return;
  }
  console.log('Connected to MYSQL db');
})

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'library API',
      version: '1.0.0',
    },
  },
  apis: ['app.js'], // files containing annotations as 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);

app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get('/', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}api-docs`;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Hello from Render!</title>
      <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
      <script>
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            disableForReducedMotion: true
          });
        }, 500);
      </script>
      <style>
        @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
        @font-face {
          font-family: "neo-sans";
          src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
          font-style: normal;
          font-weight: 700;
        }
        html {
          font-family: neo-sans;
          font-weight: 700;
          font-size: calc(50rem / 16);
        }
        body {
          background: white;
        }
        section {
          border-radius: 1em;
          padding: 1em;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-right: -50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <section>
        <a href="${url}">${url}</a>
      </section>
    </body>
  </html>
  `
  res.type('html').send(html);
});


/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of books from the database
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get('/books', (req, res) => {
  db.query('select * from book', (err, result) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(result);
  })
})

/**
 * @swagger
 * /authors:
 *  get:
 *    summary: Get all authors
 *    description: Retrive a list of authors from database 
 *    responses:
 *      200:
 *        description : list of authors
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              properties :
 *                id:
 *                  type: integer
 *                name:
 *                  type: string 
 *      500:
 *        description : list of authors
 */
app.get('/authors', (req, res) => {
  db.query('select * from author', (err, result) => {
    if (err) {
      console.error('Error fetching author:', err);
      return res.stutus(500).json({ error: 'Failed to fetch authors' });
    }
    res.json(result);
  })
})

const server = app.listen(port, () => {
  console.log(`Web sevices listening at http://localhost:${port}`);
});


server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

