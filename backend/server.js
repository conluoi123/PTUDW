import express from "express"
import ENV from "./configs/env.configs";
const app = express(); 
// đọc từ file .env 
const PORT = ENV.PORT || 3000;

// app.get('/', (req,res)=> {
//     res.send('Web game');
// })


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})