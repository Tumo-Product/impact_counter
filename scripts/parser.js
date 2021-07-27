axios.defaults.baseURL = "https://blackboxbasic.herokuapp.com/";

const parser = {
    dataFetch: async () => {
        let  url	= new URL(document.location.href);
		let _uid    = url.searchParams.get("_uid");

        if (_uid == undefined) {
            return undefined;
        }

        return axios.get(config.query_url + _uid);
    }
}