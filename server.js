const http = require('http');
const url = require('url');

let db = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        if (body) {
            req.body = parse(body);
        }
        
        if (req.method === 'POST' && parsedUrl.pathname === '/') {
            const { title, comedian, year } = req.body;
            const id = db.length + 1;
            const joke = { id, title, comedian, year };
            db.push(joke);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(db));
        } else if (req.method === 'GET' && parsedUrl.pathname === '/') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(db));
        } else if (req.method === 'PATCH' && parsedUrl.pathname.startsWith('/joke/')) {
            const id = parseInt(parsedUrl.pathname.split('/')[2]);
            const { title, comedian, year } = req.body;
            const index = db.findIndex(joke => joke.id === id);
            if (index !== -1) {
                db[index] = { ...db[index], title, comedian, year };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(db[index]));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Joke not found' }));
            }
        } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/joke/')) {
            const id = parseInt(parsedUrl.pathname.split('/')[2]);
            const index = db.findIndex(joke => joke.id === id);
            if (index !== -1) {
                const deletedJoke = db.splice(index, 1)[0];
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(deletedJoke));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Joke not found' }));
            }
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
