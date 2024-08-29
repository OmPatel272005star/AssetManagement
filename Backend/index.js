const connection = require('./connection');
const multer = require('multer');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(bodyParser.json());
app.use(cors({
    origin: [ "http://localhost:5173" ,'http://192.168.43.218:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
  }));


// Routers
const Employee_router = require('./route/Employee_router');
const Category_router = require('./route/Category_router');
const Asset_router = require('./route/Asset_router');
const Allocation_router = require('./route/Allocation_router');

app.use('/employee', Employee_router);
app.use('/category', Category_router);
app.use('/asset', Asset_router);
app.use('/allocate', Allocation_router);

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = req.body.DocumentName + "_" + req.body.DocumentId;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Add Document
const addDocument = async (req, res) => {
    const {AssetId, DocumentName, DocumentSize, DocumentFormat } = req.body;

    const sqlQuery = `INSERT INTO Document (AssetId, DocumentName, DocumentSize, DocumentFormat) 
                      VALUES (?, ?, ?, ?)`;

    try {
        await new Promise((resolve, reject) => {
            connection.query(sqlQuery, [ AssetId, DocumentName, DocumentSize, DocumentFormat], (err, result) => {
                if (err) {
                    console.error("Error in uploading file:", err);
                    reject("Failed to add document to the database");
                } else {
                    resolve("Document added successfully");
                }
            });
        });
        res.status(200).json({ message: "Document added successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Delete Document
const deleteDocument = async (req, res) => {
    const { DocumentId } = req.params;

    const sqlQuery = `DELETE FROM Document WHERE DocumentId = ?`;

    try {
        await new Promise((resolve, reject) => {
            connection.query(sqlQuery, [DocumentId], (err, result) => {
                if (err) {
                    console.error("Error in deleting document:", err);
                    reject("Failed to delete document from the database");
                } else {
                    if (result.affectedRows > 0) {
                        resolve("Document deleted successfully");
                    } else {
                        reject("Document with the specified ID not found");
                    }
                }
            });
        });
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Routes
app.post('/document/adddocument', upload.single('file'), addDocument);
app.delete('/document/deletedocument/:DocumentId', deleteDocument);

// Start Server
app.listen(3000,'0.0.0.0',() => {
    console.log(`Express server is running on port 3000`);
});
