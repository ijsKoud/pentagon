import { config } from "dotenv";
config();

import { PentagonClient } from "./lib/Client.js";

// TO DO: Add code
const client = new PentagonClient();
void client.run();
