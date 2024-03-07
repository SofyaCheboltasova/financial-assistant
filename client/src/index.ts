import "./sass/main.scss";
import MainPage from "./scripts/layout/main";
import PageLoader from "./scripts/layout/pageLoader";

const loader = new PageLoader();
const main = new MainPage(loader);
document.body.appendChild(main.tag);

