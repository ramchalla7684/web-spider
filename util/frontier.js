class Frontier {
    constructor(seeds) {
        this.urls = [];
        this.loadFrontier();
        this.add(seeds);
    }

    add(arg) {

    }

    loadFrontier() {

    }


    parse(url) {
        let protocol = url.split("://")[0];
        let urn = url.split("://")[1];

        urn = urn.split("/");

        let fqdn = urn[0];
        fqdn = fqdn.split(".");
        
        urn.shift();
        let endpoint = urn.join("");


        let host;
        let domain;
        if (fqdn.length === 3) {
            host = fqdn[0];
            domain = fqdn[1] + "." + fqdn[2];
        }
        else {
            domain = fqdn;
        }

        return {protocol, host, domain, endpoint};
    }
}