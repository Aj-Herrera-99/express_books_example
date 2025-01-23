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

const destroy = (req, res) => {
    // // recuperiamo l'id dall' URL
    // const { id } = req.params;
    // //Eliminiamo il post dal blog
    // connection.query("DELETE FROM posts WHERE id = ?", [id], (err) => {
    //     if (err)
    //         return res.status(500).json({ error: "Failed to delete post" });
    //     res.sendStatus(204);
    // });
};

module.exports = { index, destroy, show };
