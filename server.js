import app from "./src/app.js";
import connectTOdb from "./src/config/database.js";


connectTOdb()
app.listen(3000, () => {
    console.log("server is running on 3000");
})
