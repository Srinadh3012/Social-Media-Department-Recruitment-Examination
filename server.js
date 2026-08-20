const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const RESULTS_FILE = path.join(__dirname, 'results.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files

// Initialize results.json if it doesn't exist
if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify([]));
}

// API Endpoint to receive exam submissions
app.post('/api/submit', (req, res) => {
    try {
        const submission = req.body;
        
        // Add timestamp
        submission.timestamp = new Date().toISOString();
        
        // Read existing results
        const data = fs.readFileSync(RESULTS_FILE, 'utf8');
        const results = JSON.parse(data);
        
        // Append new result
        results.push(submission);
        
        // Save back to file
        fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 4));
        
        res.status(200).json({ message: 'Submission successful' });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// API Endpoint to fetch all results (for admin dashboard)
app.get('/api/results', (req, res) => {
    try {
        const data = fs.readFileSync(RESULTS_FILE, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading results:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Exam Server running on http://localhost:${PORT}`);
    console.log(`Admin Dashboard available at http://localhost:${PORT}/admin.html`);
});
