let href = window.location.href;
href     = href.substring(0, href.indexOf("?"));

axios.defaults.baseURL  = "https://blackboxbasic.herokuapp.com/";

let config = {
    query_url           : "impact_counter/getsetsone?_uid="
}