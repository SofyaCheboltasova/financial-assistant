import "./sass/main.scss";
import MainPage from "./scripts/layout/main";
import PageLoader from "./scripts/layout/pageLoader";

const pageLoader = new PageLoader();
const main = new MainPage();
document.body.appendChild(main.tag);

