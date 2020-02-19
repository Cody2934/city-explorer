const { app } = require('./app.js');
const port = process.envPORT || 9000;

app.listen(port, () => console.log (`Example app listening on port ${port}`));