import { homeTemplate } from "./home";
import { show } from "./utils";

const root = document.getElementById("root");
show(root, homeTemplate(root));
