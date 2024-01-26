const express = require('express');
const cors = require('cors');
const CompaniesDB = require("./modules/companiesDB.js");

require('dotenv').config();

const app = express();

const db = new CompaniesDB();
app.use(express.json());
app.use(cors());
// const mongoDBConnectionString = process.env.MONGODB_CONN_STRING;
// if (!mongoDBConnectionString) {
//     console.error('MongoDB connection string is not set in .env file');
//     process.exit(1); // Exit if no connection string is found
// }

// db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`server listening on: ${process.env.PORT || 8080}`);
    });
// }).catch((err)=>{
//     console.log(err);
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
    res.json({ message: "API Listening" });
});

// POST /api/companies - Create a new company
app.post('/api/companies', (req, res) => {
    db.addNewCompany(req.body)
        .then(company => res.status(201).json(company))
        .catch(err => res.status(500).json({ error: err }));
});

// GET /api/companies - Retrieve all companies
app.get('/api/companies', (req, res) => {
    const { page, perPage, name } = req.query;
    db.getAllCompanies(page, perPage, name)
        .then(companies => res.json(companies))
        .catch(err => res.status(500).json({ error: err }));
});

// GET /api/company/:id - Retrieve a single company by ID
app.get('/api/company/:id', (req, res) => {
    db.getCompanyById(req.params.id)
        .then(company => {
            if (company) {
                res.json(company);
            } else {
                res.status(404).json({ message: "Company not found" });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
});

// PUT /api/company/:id - Update a company
app.put('/api/company/:id', (req, res) => {
    db.updateCompanyById(req.params.id, req.body)
        .then(company => res.json(company))
        .catch(err => res.status(500).json({ error: err }));
});

// DELETE /api/company/:id - Delete a company
app.delete('/api/company/:id', (req, res) => {
    db.deleteCompanyById(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({ error: err }));
});

// //const HTTP_PORT = process.env.PORT || 8080;
// app.listen(process.env.PORT, () => {
//     console.log(`Server listening on: ${process.env.PORT || 8080}`);
// });