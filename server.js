import dotenv from "dotenv";
import { testAi } from "./src/services/ai.service.js";
dotenv.config({ path: "./.env" });

import app from "./src/app.js";
import connectTOdb from "./src/config/database.js";

testAi()

connectTOdb()
app.listen(3000, () => {
    console.log("server is running on 3000");
})
