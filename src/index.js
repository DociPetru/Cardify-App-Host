import ReactDOM from "react-dom";
import React from "react";
import { HashRouter } from "react-router-dom";

import Header from "./components/header/header.js";
import Main from "./components/main/main.js";

import AppRouter from "./components/routes/AppRouter.js";

import "./styles/styles.scss";

const app = express();
const cors = require("cors");

app.use(cors());

const App = () => <AppRouter />;

ReactDOM.render(<App />, document.getElementById("root"));
