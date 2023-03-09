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

        // Make the header collapse
        this.searchContainer().addEventListener("scroll", (e) => {
            if(this.collapsibleHeader().classList.contains("collapsible-header--scrolled")){
                if(e.target.scrollTop == 0){
                    this.collapsibleHeader().classList.remove("collapsible-header--scrolled")
                }
            } else {
                this.collapsibleHeader().classList.add("collapsible-header--scrolled")
            }
        })

        // show detailpage or load data
        window.addEventListener("popstate", (e) => {
            if(!e.state.barcode){
                this.fetchData(e.state, false, false)
            } else {
                detailPage(e.state.barcode, this, true)
            }
        })
    }

    init() {
        // Set a value on the search input
        this.searchInput().value = this.query;
        // Bind events
        this.bindEvents()

        // If id open detail page
        if(this.id) {
            detailPage(this.id, this)
            // Fetch data for later
            this.fetchData(false, false, false)    
        } else {
            // Fetch data
            this.fetchData(false, true, false)
        }
    }

    // Fetch data
    fetchData(popState, onLoad, detailpage, paginator) {
        // if loading or onclick of the paginator
        if(onLoad || paginator){
            setUrl(this)
        } 

        // Loading
        this.loading = true;
        this.searchCount().textContent = "loading..."
        // Show loading icon
        this.node.classList.add("search--loading")
        // Disable the button
        this.searchControl().disabled = true

        if(popState) {
            if(!detailpage){
                // Close modal
                const detailModal = document.querySelector(".detailpage")
                detailModal.ariaExpanded = "false";
            }

            // Set query on search input 
            this.searchInput().value = popState.query;
            // Fetch data
            const fetchExec = async () => {
                const response = await getData("all", popState.query, popState.page, popState.pageSize);
                // Set data
                this.data = response
                // Time to render
                this.render()
            }
            fetchExec()
        } else {
            // Fetch direct
            const fetchExec = async () => {
                const response = await getData("all", this.query, this.page, this.pageSize);
                // Set data
                this.data = response
                // Time to render
                this.render()
            }
            fetchExec()
        }

    }

    // Getters
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

    // Total amount of pages
    pageCount () {
        const pageSize = this.pageSize;
        const totalCount = this.data.count;
        const calculatedCount = Math.ceil(totalCount / pageSize) >= 150 ? 150 : Math.ceil(totalCount / pageSize)
        return calculatedCount;
    }

    render() {
        if(this.data != null) {
            // Loading = false
            this.loading = false;
            this.node.classList.remove("search--loading")
            this.searchControl().removeAttribute("disabled")

            // Set total amount of instances
            if(this.data.count){
                this.searchCount().textContent =  `Totaal: ${this.data.count} items`;
            } else {
                this.searchCount().textContent =  `Totaal: 0 items`;
            }
            this.renderItems();
        } else {            
            // Still loading
            this.searchCount().textContent = "loading..."
        }
    }

    renderItems () {
        // RESET CHILDREN
        const loadingIcon = document.querySelector("div.icon.icon--loading.icon--loading-results")
        // .cloneNode(true)
        if(this.searchContainer().children.length){
            const array = Array.from(this.searchContainer().children)
            array.forEach(item => item.remove())
        }

        // ERROR STATE : {O items}
        if(this.data.products.length == 0) {
            // remove paginator
            this.paginator().style.display = "none"
            // Make empty section
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
            // Make paginator
            this.paginator().style = ""
            this.makePaginator()
            // show results
            searchResults(this.data.products)
            .forEach(item => {
                this.searchContainer().appendChild(item)
                // Add listener
                item.addEventListener("click", (e) => {
                    let id = e.target.nodeName !== "SECTION" ? e.target.parentNode.dataset.id : e.target.dataset.id
                    detailPage(id, this)
                })
            })

            // Append loading icon
            this.searchContainer().appendChild(loadingIcon)
        }
    }

    // Make paginator
    makePaginator() {
        this.searchPaginatorControl().forEach(item => {  
            // Paginator switch
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

// Start!
if(searchForm) {
    [...searchForm].forEach(form => new Search(form))
}