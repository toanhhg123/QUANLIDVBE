const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const route = require("./route");
const methodOverride = require("method-override");
const sortMiddleware = require("./app/Middelwares/SortMiddelwares");
const app = express();
const port = 3000;
app.use(sortMiddleware.SortMiddelware)
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
route.route(app);

//handlebars-----------------------------------------
app.set("view engine", ".hbs");
app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs",
        helpers: {
            sum: (index) => index + 1,
            Sort: (field, sort) => {
                const type = (field === sort.column) ? sort.type : 'default';
                const icons = {
                    default: 'fas fa-sort',
                    ASC: "fas fa-sort-amount-down-alt",
                    DESC: "fas fa-sort-amount-down",
                }
                const types = {
                    default: 'ASC',
                    ASC: 'DESC',
                    DESC: 'ASC',
                }

                return ` <a href="?_sort&column=${field}&type=${types[type]}">
                             <i class="${icons[type]}"></i>
                             </a>`
            }
        },

    })
);
app.set("views", path.join(__dirname, "/resources/views"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});