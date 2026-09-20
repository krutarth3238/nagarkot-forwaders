const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ok: true}));
app.listen(5000, () => console.log('Test server listening on 5000'));
