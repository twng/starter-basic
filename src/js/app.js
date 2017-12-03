/* global $:false */
const app_msg = "app.js loaded";
const jquery_msg = "jquery has been loaded";
const arrowfunc = (msg) => {
    console.log(msg);
}
console.log(app_msg);

// jquery document is ready
$(function() {
    arrowfunc(jquery_msg);
});
