let express = require("express");
let app = express();

app.use(express.static("./static"));
const PORT=process.env.PORT||81;
app.listen(PORT, function() {
    console.log("Listening on port 81");
});
