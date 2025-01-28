const connection = require("../data/db");

const index = (req, res) => {
    // prepariamo la query
    const sql = "SELECT * FROM books";
    // eseguiamo la query
    connection.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed" });
        res.json(results);
    });
};

const show = (req, res) => {
    // recuperiamo l'id dall' URL
    const id = req.params.id;
    // prepariamo la query per il book
    const booksSql = ` 
        SELECT books.* FROM books 
        WHERE id = ? 
    `;
    // prepariamo la query per le recensioni del book
    const reviewsSql = `
        SELECT reviews.* FROM reviews 
        WHERE book_id = ?
    `;
    // eseguiamo la prima query per il book
    connection.query(booksSql
        , [id], (err, bookResults) => {
            if (err)
                return res.status(500).json({ error: "Database query failed" });
            if (bookResults.length === 0)
                return res.status(404).json({ error: "book not found" });

            // recuperiamo il book
            const book = bookResults[0];

            // se è andata bene, eseguaimo la seconda query per le recensioni
            connection.query(reviewsSql, [id], (err, reviewsResults) => {
                if (err)
                    return res.status(500).json({ error: "Database query failed" });
                // aggiungiamo le recensioni del book
                book.reviews = reviewsResults;
                res.json(book);
            });
        });
};

const storeReviews = (req, res) => {
    console.log(req.body);
    const bookId = req.params.id;
    const { text, name, vote } = req.body;
    const sql = 'INSERT INTO reviews (text, name, vote, book_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [text, name, vote, bookId], (err, results) => {
        if (err)
            return res.status(500).json({ error: "errore del database" });
        res.status(201);
        res.json({ message: "Review aggiunta", id: results.insertId });
    });
};

const destroyReviews = (req, res) => {
    const bookId = req.params.id;
    const reviewId = req.params.review_id;
    console.log(req.params);
    const sql = 'DELETE FROM reviews WHERE id = ? AND book_id = ?';
    connection.query(sql, [reviewId, bookId], (err, results) => {
        if (err)
            return res.status(500).json({ error: "errore del database" });
        res.status(201);
        res.json({ message: "Review eliminata" });
    });
};


const destroy = (req, res) => {
    // recuperiamo l'id dall' URL
    const id = req.params.id;
    // prepariamo la query
    const sql = "DELETE FROM books WHERE id = ?";
    // eseguiamo la query
    connection.query(sql, [id], (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed" });
        res.json({ success: true });
    });
};

module.exports = { index, show, storeReviews, destroyReviews, destroy };
