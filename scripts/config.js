let href = window.location.href;
href     = href.substring(0, href.indexOf("?"));

axios.defaults.baseURL  = "https://content-tools.tumo.world:4000/";

let config = {
    query_url           : "impact_counter/getsetsone?_uid="
}