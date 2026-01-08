const express = require('express'); 
const app = express; 
// đọc từ file .env 
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=> {
    res.send('Web game');
})


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})