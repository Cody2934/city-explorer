const { app } = require('./app.js');
const port = process.env.PORT || 9000;

app.listen(port, () => console.log (`Example app listening on port ${port}`));