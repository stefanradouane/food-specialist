const baseEndpoint = 'https://nl.openfoodfacts.org/cgi/search.pl?search_terms=&json=true'
const searchForm = document.querySelectorAll(".search")


const apiEndpoint = (query, page, pageSize) => {
    return `https://nl.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page=${page}&page_size=${pageSize}&json=true`
}


class Search {
    constructor(node) {
        this.node = node;
        this.data = null;
        this.query = "";
        this.page = 1;
        this.pageSize = 30;
        this.pages = 1;
        this.init()
    }

    bindEvents() {
        this.searchForm().addEventListener("submit", (e) => {
            e.preventDefault()
        })

        // this.searchPaginatorControl().forEach(paginator => {
        //     if(paginator.value == "next"){ 
        //         console.log(paginator)
        //         paginator.addEventListener("click", (e) => {
        //             console.log(e.target)
        //             const current = this.page
        //             this.page = current + 1;
        //             this.fetchData()
        //         })
        //     }
        // })

        this.searchControl().addEventListener("click", (e) => {
            this.query = this.searchInput().value;
            this.page = 1;
            this.fetchData()
        })

        
    }

    init() {
        this.fetchData()
        this.render()
        this.bindEvents()
        // if(this.data != null){
        // }
    }

    fetchData() {
        const fetchExec = async () => {
            const response = await fetch(apiEndpoint(this.query, this.page, this.pageSize));
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            this.data = await response.json();
            this.render()
        }

        fetchExec()
    }

    searchContainer() {
        return this.node.querySelector(".search__results")
    }

    searchForm() {
        return this.node.querySelector(".search__form")
    }

    paginator() {
        return this.node.querySelector(".paginator")
    }

    searchPaginatorControl() {
        return this.node.querySelectorAll(".paginator__control")
    }

    searchControl() {
        return this.node.querySelector(".search__control")
    }

    searchCount() {
        return this.node.querySelector(".search__count")
    }

    searchInput() {
        return this.node.querySelector(".search__input")
    }

    detailModal() {
        return document.querySelector(".detailpage")
    }

    detailModalImage() {
        return document.querySelector(".detailpage__image")
    }

    detailModalTitle() {
        return document.querySelector(".detailpage__title")
    }

    detailModalProtein() {
        return document.querySelector(".detailpage__protein")
    }

    pageCount () {
        const pages = this.pages;
        const pageSize = this.pageSize;
        const totalCount = this.data.count;
        const calculatedCount = Math.ceil(totalCount / pageSize) >= 150 ? 150 : Math.ceil(totalCount / pageSize)
        return calculatedCount;
    }


    render() {
        if(this.data != null) {
            if(this.data.count){
                this.searchCount().textContent =  `Totaal: ${this.data.count} items`;
            } else {
                this.searchCount().textContent =  `Totaal: 0 items`;
            }
            this.renderItems();
            console.log(this.data)
        } else {            
            this.searchCount().textContent = "loading..."
        }
    }

    renderItems () {
        // RESET CHILDREN
        if(this.searchContainer().children.length){
            const array = Array.from(this.searchContainer().children)
            array.forEach(item => item.remove())
        }

        if(this.data.products.length == 0) {
            this.paginator().style.display = "none"

            const emptySection = document.createElement("section");
            emptySection.classList.add("result-empty")
            const title = document.createElement("h2")
            title.textContent = "Geen producten gevonden"
            title.classList.add("title")
            title.classList.add("title--h2")
            const image = document.createElement("img")
            image.classList.add("result-empty__image")
            image.src = "public/assets/images/eaten-apple.png" 
            emptySection.appendChild(title)
            emptySection.appendChild(image)
            this.searchContainer().appendChild(emptySection)
        } else {
            this.paginator().style = ""
            this.makePaginator()

            const list = this.data.products.map(product => {
                const itemContainer = document.createElement("section");
                itemContainer.classList.add("result")
                itemContainer.dataset.id = product._id
                const itemImage = document.createElement("img");
                itemImage.classList.add("result__image")
                itemImage.src = product.image_front_url
                const item = document.createElement("h2")
                item.classList.add("result__title")
                item.textContent = product.product_name;
                const itemContent = document.createElement("p")
                itemContent.classList.add("result__info")
                itemContent.textContent = `Proteine ${product.nutriments.proteins}${product.nutriments.proteins_unit} Totaal, ${product.nutriments.proteins_100g}${product.nutriments.proteins_unit} / 100${product.nutriments.proteins_unit}`;
                itemContainer.appendChild(itemImage) 
                itemContainer.appendChild(item) 
                itemContainer.appendChild(itemContent) 
                return itemContainer
            })

            list.forEach(item => {
                this.searchContainer().appendChild(item)
                item.addEventListener("click", (e) => {
                    this.showModal(e)
                })
            })
        }
    }

    makePaginator() {
        console.log(this.page)
        console.log(this.pageCount())
        console.log(this.paginator())
        console.log(this.searchPaginatorControl())
        const removeListerens = () => {
            this.searchPaginatorControl().forEach(item => {
                item.parentNode.replaceChild(item.cloneNode(true), item);
            })
        }
        this.searchPaginatorControl().forEach(item => {
            // item.removeEventListener("click" , pageDown, {capture: false})

            console.log(this.pageCount() == 1 || this.page == 1)
            switch (item.value) {
                case "previous":
                    if(this.pageCount() == 1 || this.page == 1) {
                        item.disabled = true   
                    }  else {                        
                        item.removeAttribute("disabled") 
                        item.addEventListener("click", () => {
                            removeListerens()
                            const current = this.page
                            this.page = current - 1;
                            this.fetchData()
                        })
                    }

                    

                    

                  break;
                case "current":
                    if (this.page == 150) {
                        item.removeAttribute("disabled") 
                        item.textContent = "1"
                    } else if (this.page == 150 || this.page == 149 || this.page == 148) {
                        item.textContent = "1"
                    } else {
                        item.textContent = this.page

                    }
                  break;
                case "next":
                    if(this.pageCount() == 1) {
                        item.style.display = "none"   
                    }
                    
                    if(this.page == 150 || this.page == 149 || this.page == 148) {
                        item.textContent = "..."
                        
                    } else {
                        item.textContent = this.page + 1
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page
                            this.page = current + 1;
                            this.fetchData()
                        })
                    }
                    
                  break;
                case "dblnext":
                    if(this.pageCount() == 1) {
                        item.style.display = "none"   
                    }

                    if(this.page == 150) {
                        item.textContent = this.page - 2;
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page
                            this.page = current - 2;
                            this.fetchData()
                        })
                    } else if (this.page == 149){
                        item.textContent = this.page - 1;
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page - 1
                            this.page = current;
                            this.fetchData()
                        })                        
                    } else if (this.page == 148){
                        item.textContent = this.page;                      
                    } else {
                        item.textContent = this.page + 2
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page
                            this.page = current + 2;
                            this.fetchData()
                        })
                    }

                  break;
                case "none":
                    if(this.pageCount() == 1) {
                        item.style.display = "none"   
                    }

                    if(this.page == 150) {
                        item.textContent = this.page - 1;
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page - 1
                            this.page = current;
                            this.fetchData()
                        })                        
                    } else if (this.page == 149){
                        item.textContent = this.page;                        
                    } else if (this.page == 148){
                        item.textContent = this.page + 1;
                        item.addEventListener("click", (e) => {
                            removeListerens()
                            const current = this.page + 1
                            this.page = current;
                            this.fetchData()
                        })                        
                    } else {
                        item.textContent = "..."
                    }
                  break;
                case "last":
                    if(this.pageCount() == 1) {
                        item.style.display = "none"   
                    }

                    item.addEventListener("click", (e) => {
                        removeListerens()
                        const current = this.pageCount()
                        this.page = current;
                        this.fetchData()
                    })

                    item.textContent = this.pageCount()
                  break;
                case "continue":
                    if(this.pageCount() == 1) {
                        item.disabled = "true"  
                    } else if (this.page == 150){
                        item.disabled = "true"  
                    } else {
                        item.removeAttribute("disabled") 
                    }
                break;
            }

            // Reset
            item.classList.remove("paginator__control--active")
            if(item.textContent == this.page){
                item.classList.add("paginator__control--active")
            }
        })



    }

    async showModal(e){
        let target = e.target.nodeName !== "SECTION" ? e.target.parentNode.dataset.id : e.target.dataset.id
        console.log(target)

        this.detailModal().ariaExpanded = "true"

        
        const fetchDetailPage = async () => {
            const response = fetch(`https://nl.openfoodfacts.org/api/v0/product/${target}.json`)
            console.log(await response)
            const detailData = await response;
            if (!detailData.ok) {
                throw new Error("Network response was not ok");
            }

            // const data = await response
            // console.log(data)
            // return data
            return detailData.json()
        }

        const productInfo = await fetchDetailPage()

        this.detailModalTitle().textContent = productInfo.product.product_name
        this.detailModalImage().src = productInfo.product.image_front_url
        this.detailModalProtein().textContent = `Proteine ${productInfo.product.nutriments.proteins}${productInfo.product.nutriments.proteins_unit} Totaal, ${productInfo.product.nutriments.proteins_100g}${productInfo.product.nutriments.proteins_unit} / 100${productInfo.product.nutriments.proteins_unit}`;


        console.log(this.detailModal())
    }
}

if(searchForm) {
    [...searchForm].forEach(form => new Search(form))
}

// import React, {useEffect, useState} from 'react';
// import {createRoot} from 'react-dom/client';
// import {Paginator} from './search-paginator';

// const searchForm = document.querySelector(".search")

// const searchControl = document.querySelector(".search__control")
// const searchInput = document.querySelector(".search__input")


// const Searchresults = () => {
//     const [query, setQuery] = useState("");
//     const [page, setPage] = useState(1);
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true)

//     const handleQuery = (e) => {
//         e.preventDefault()
//         console.log("test")
//         console.log(searchInput.value)
//         setQuery(searchInput.value)
//         setPage(1)
//         // console.dir(e.target[0].value)
//     }

//     const handlePaginator = (e) => {
//         if(e.target.value == "next") {
//             setPage(page + 1)
            
//         } else if (e.target.value == "previous") {
//             console.log(e.target.nextSibling)
//             if(page > 1) {
//                 setPage(page - 1)
//             }
//         }
//     }

//     const previousButton = () => {
//         console.log(page)
//         if(page > 1) {
//             return (<button onClick={handlePaginator} value="previous">Prev</button>)
//         }
//         return (<button onClick={handlePaginator} value="previous" disabled>Prev</button>)

//     }


//     useEffect(() => {
//         // setLoading(true)
//         const fetchData = async () => {
//             const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page=${page}&page_size=30&action=process&json=1`);
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             setData(await response.json())
//         }
//         fetchData()
//     }, [query, page])

//     useEffect(() => {
//         if(data == null) {
//             return
//         }
//         setLoading(false);  
//         searchControl.addEventListener("click", handleQuery)

//         return () => {
//             searchControl.removeEventListener("click", handleQuery)
//         }
//     }, [data]);


//     if(loading){
//         return <div>Loading...</div>
//     }

//     const names = () => {
//     return data.products.map((product, i) => {return (<div key={i}>{product._id}:  </div>)})
//     }

//     console.log(data)

//     return (<div>
//         {names()}
//         {Paginator(data.page_count ,data.count)}
//         {/* <button onClick={handlePaginator} value="previous" disabled>Prev</button> */}
//         {previousButton()}
//         <button onClick={handlePaginator} value="next">Next</button>
//     </div>)
// }

// if(resultsContainer){
//     const root = createRoot(resultsContainer);
//     root.render(<Searchresults />);
// }


// TO DO:
// standaard query die producten filterd ofzo idk
// Connectie maken met de databank van food.api
// Producten tonen.
// FIX paginator.
// - Page = max // FIX PAGE + MAX => anders gaat pagina door naar Infinity
// - Page == 1

// ON QUERY CHANGE => set page = 1 (FIX double use)
// 


// Home pagina blobs
// Detail pagina
// 