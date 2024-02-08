/*********************************************************************************
 * WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 ** Name: Arman Jeevani Student ID: 158510180 Date: 24/01/2024
 * Cyclic Link:https://crimson-abalone-yoke.cyclic.app/
*/

const express = require('express');
const cors = require('cors');
const CompaniesDB = require("./modules/companiesDB.js");
require('dotenv').config();

const app = express();
const db = new CompaniesDB();
const path = require('path');

app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '/index.html');

  // Send the HTML file
  res.sendFile(filePath);
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

app.use(express.static(__dirname));

// Initialize database and start server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.error("Failed to make database connection!");
    console.error(err);
});
