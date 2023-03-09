export const getData = (type, query, page, pageSize) => {
    const apiEndpoint = (type, query, page, pageSize) => {
        if(type == "detail") {
            return `https://nl.openfoodfacts.org/api/v0/product/${query}.json`

        } else if (type == "all") {
            return `https://nl.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page=${page}&page_size=${pageSize ? pageSize : 30}&json=true`
        }
    }

    const fetchExec = async (atype, hoi, page, pageSize) => {
        const response = await fetch(apiEndpoint(atype, hoi, page, pageSize));
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return await response.json();
    }

    return fetchExec(type, query, page, pageSize)
};