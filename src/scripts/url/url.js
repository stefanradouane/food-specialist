/**
 * Changes the URL to to current query.
 * @param {Object} search 
 * @param {String} id 
 */
export const setUrl = (search, id) => {
    let query;
    let page;
    let barcode;
    // If there is an id set the url for only this id
    if(id){
        barcode = id
        query = search?.query || "";
        page = search?.page || 1;
        history.pushState({query, page, barcode}, null, `?id=${barcode}`)
    } else {
        // if no query, only current page
        if(!search?.query) {
            query = search?.query || "";
            page = search?.page || 1;
            history.pushState({query, page, barcode}, null, `?page=${page}`)
        // if query, page and query
        } else {
            query = search?.query || "";
            page = search?.page || 1;
            history.pushState({query, page, barcode}, null, `?q=${query}&page=${page}`)
        }   
    }
};

/**
 * Returns params based on query string.
 * @param {string} query A (serialized) query string.
 * @return {Object} Params (parameters) object.
 */
export const parseQuery = (query) => {
    const searchParams = new URLSearchParams(query["search"]);
    const objectParams = Object.fromEntries(searchParams)
    const queryObject = {
        "id": objectParams.id,
        "q": objectParams.q ? objectParams.q : "",
        "page": objectParams.page,
    }
    return queryObject
};