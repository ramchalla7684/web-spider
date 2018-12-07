class URL {
    constructor() {

    }

    static parse(hyperlink) {
        let protocol = hyperlink.split("://")[0];
        let urn = hyperlink.split("://")[1];

        urn = urn.split("/");

        let fqdn = urn.shift();
        fqdn = fqdn.split(".");

        let endpoint = urn.join("/");

        if (endpoint === "") {
            endpoint = "/";
        }


        let host;
        let domain;
        if (fqdn.length === 3) {
            host = fqdn.shift();
        }

        domain = fqdn[0] + '.' + fqdn[1];

        return { protocol, host, domain, endpoint };
    }

    static join(url) {

        let hyperlink = '';

        hyperlink = hyperlink.concat(url.protocol === undefined ? '' : url.protocol.concat('://'));
        hyperlink = hyperlink.concat(url.host === undefined ? '' : url.host.concat('.'));
        hyperlink = hyperlink.concat(url.domain === undefined ? '' : url.domain.concat('/'));
        hyperlink = hyperlink.concat(url.endpoint === undefined ? '' : url.endpoint);

        return hyperlink;
    }

    static toAbsoulte(hyperLink, url) {
        if (!hyperLink.startsWith("http://") && !hyperLink.startsWith("https://")) {

            let suffix = '';
            if (hyperLink.startsWith("//")) {
                suffix = 'https://';
            }
            else {
                suffix = suffix.concat(url.protocol, '://', url.host, '.', url.domain);

                if (!hyperLink.startsWith("/")) {
                    suffix = suffix.concat('/');
                }

            }

            hyperLink = suffix.concat(hyperLink);
        }
        return hyperLink;
    }

}

module.exports.URL = URL;