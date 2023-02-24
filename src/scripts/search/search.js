import {paginatorSwitch} from './search-paginator'
import {detailPage} from '../detailpage/detailpage'
import {getData} from '../api/getdata'
import {parseQuery, setUrl} from '../url/url'

import {searchResults} from './search-results'

const searchForm = document.querySelectorAll(".search")

class Search {
    constructor(node) {
        this.loading = true;
        this.node = node;
        this.data = null;
        this.query = parseQuery(window.location).q || "";
        this.page = parseQuery(window.location).page || 1;
        this.id = parseQuery(window.location).id || "";

        this.pageSize = 30;
        this.init()
    }

    bindEvents() {
        this.searchForm().addEventListener("submit", (e) => {
            // Prevent the page from loading again.
            e.preventDefault()
        })

        this.searchControl().addEventListener("click", (e) => {
            // Check if the seacht value is changed
            if(this.query !== this.searchInput().value) {
                // If changed, change query and fetch data again
                this.query = this.searchInput().value;
                // Set page to 1.
                this.page = 1;
                // Prevent paginator listeners to duplicate on query change.
                this.removeListerens()
                // Fetch data
                this.fetchData(false, true, false)
            }
        })

        this.searchContainer().addEventListener("scroll", (e) => {
            if(this.collapsibleHeader().classList.contains("collapsible-header--scrolled")){
                if(e.target.scrollTop == 0){
                    this.collapsibleHeader().classList.remove("collapsible-header--scrolled")
                }
            } else {
                this.collapsibleHeader().classList.add("collapsible-header--scrolled")
            }
        })

        window.addEventListener("popstate", (e) => {
            console.log(e.state)
            // this.searchInput().value = this.query;
            if(!e.state.barcode){
                this.fetchData(e.state, false, false)
            } else {
                detailPage(e.state.barcode, this, true)
            }
        })
    }

    init() {
        // console.log(this)
        this.searchInput().value = this.query;
        this.bindEvents()

        if(this.id) {
            detailPage(this.id, this)
            this.fetchData(false, false, false)    
        } else {
            this.fetchData(false, true, false)
        }

        // Set query as value on input
    }

    fetchData(popState, onLoad, detailpage) {
        if(onLoad){
            setUrl(this)
        } 

        this.loading = true;
        this.searchCount().textContent = "loading..."
        this.node.classList.add("search--loading")
        this.searchControl().disabled = true
        if(popState) {
            if(!detailpage){
                const detailModal = document.querySelector(".detailpage")
                detailModal.ariaExpanded = "false";
            }

            this.searchInput().value = popState.query;
            const fetchExec = async () => {
                const response = await getData("all", popState.query, popState.page, popState.pageSize);
                this.data = response
                this.render()
            }
            fetchExec()
        } else {
            const fetchExec = async () => {
                const response = await getData("all", this.query, this.page, this.pageSize);
                this.data = response
                this.render()
            }
            fetchExec()
        }

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

    collapsibleHeader() {
        return document.querySelector(".collapsible-header")
    }


    pageCount () {
        const pageSize = this.pageSize;
        const totalCount = this.data.count;
        const calculatedCount = Math.ceil(totalCount / pageSize) >= 150 ? 150 : Math.ceil(totalCount / pageSize)
        return calculatedCount;
    }


    render() {
        if(this.data != null) {
            this.loading = false;
            this.node.classList.remove("search--loading")
            this.searchControl().removeAttribute("disabled")

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
        const loadingIcon = document.querySelector("div.icon.icon--loading.icon--loading-results").cloneNode(true)
        if(this.searchContainer().children.length){
            const array = Array.from(this.searchContainer().children)
            array.forEach(item => item.remove())
        }

        // ERROR STATE : {O items}
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
            searchResults(this.data.products)
            .forEach(item => {
                this.searchContainer().appendChild(item)
                item.addEventListener("click", (e) => {
                    let id = e.target.nodeName !== "SECTION" ? e.target.parentNode.dataset.id : e.target.dataset.id
                    // setUrl(this, id)
                    detailPage(id, this)
                })
            })

            this.searchContainer().appendChild(loadingIcon)
        }
    }

    makePaginator() {
        this.searchPaginatorControl().forEach(item => {  
            paginatorSwitch(item, this);

            // Reset active class every page button
            item.classList.remove("paginator__control--active")
            if(item.textContent == this.page){
                item.classList.add("paginator__control--active")
            }
        })



    }

    // Function for the paginator to replace each item
    // By replacing an item all event listeners will be removed.
    removeListerens = () => {
        this.searchPaginatorControl().forEach(item => {
            item.parentNode.replaceChild(item.cloneNode(true), item);
        })
    }
}

if(searchForm) {
    [...searchForm].forEach(form => new Search(form))
}