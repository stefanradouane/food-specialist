export const paginatorSwitch = (item, search) => {
    // Reset buttons
    const removeListerens = () => {
        search.searchPaginatorControl().forEach(item => {
            item.parentNode.replaceChild(item.cloneNode(true), item);
        })
    }

    // Paginator switch
    switch (item.value) {
        case "previous":
            if(search.pageCount() == 1 ){
                item.style.display = "none" 
            } else if ( search.page == 1) {
                item.disabled = true   
                item.style = ""   
            }  else {                        
                item.style = ""
                item.removeAttribute("disabled") 
                item.addEventListener("click", () => {
                    removeListerens()
                    const current = search.page
                    search.page = current - 1;
                    search.fetchData(false, false, false, true)
                })
            }
          break;

        case "next":
            if(search.pageCount() == 1) {
                item.disabled = "true"  
                item.style.display = "none"
            } else if (search.page == search.pageCount()){
                item.style = ""
                item.disabled = "true"  
            } else {
                item.style = ""
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("next")
                    removeListerens()
                    const current = search.page
                    search.page = current + 1;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;

          case "first":
            if(search.pageCount() == 1) {
                item.textContent == "1"
            } else if (search.page == "1") {
                item.textContent = "1"
                item.style = ""
            } else {
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("first")
                    removeListerens()
                    const current = search.page
                    search.page = 1;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;

          case "two":
            if(search.pageCount() <= 2) {
                item.style.display = "none"  
            } else if (search.page >= 5) {
                item.textContent = "..."
                console.log(item)
            } else if (search.page == "2") {
                item.textContent = "2"
                item.style = ""  
            } else {
                item.textContent = "2"
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("second")
                    removeListerens()
                    const current = search.page
                    search.page = 2;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;
        
          case "three":
            if(search.pageCount() <= 3) {
                  item.style.display = "none"  
            } else if (search.page == search.pageCount() || search.page == (search.pageCount() - 1) || search.page == (search.pageCount() - 2) || search.page == (search.pageCount() - 3)) {
                item.textContent = search.pageCount() - 4
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("six")
                    removeListerens()
                    const current = search.page
                    search.page = search.pageCount() - 4;
                    search.fetchData(false, false, false, true)
                })
            } else if (search.page >= 5) {
                item.style = ""  
                item.textContent = search.page - 1

                item.addEventListener("click", (e) => {
                    console.log("second")
                    removeListerens()
                    const current = search.page
                    search.page = current - 1;
                    search.fetchData(false, false, false, true)
                })
            } else if (search.page == "3") {
                item.textContent = "3"
                item.style = ""  
            } else {
                item.textContent = "3"
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("third")
                    removeListerens()
                    const current = search.page
                    search.page = 3;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;

          case "four":
            if(search.pageCount() <= 4) {
                  item.style.display = "none"  
            } else if (search.page == search.pageCount() || search.page == (search.pageCount() - 1) || search.page == (search.pageCount() - 2) || search.page == (search.pageCount() - 3)) {
                item.textContent = search.pageCount() - 3
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("six")
                    removeListerens()
                    const current = search.page
                    search.page = search.pageCount() - 3;
                    search.fetchData(false, false, false, true)
                })
            } else if (search.page == (search.pageCount() - 3)) {
                item.textContent = search.pageCount() - 3
                item.style = ""  
            } else if (search.page >= 5) {
                item.style = ""  
                item.textContent = search.page
            } else {
                item.textContent = "4"
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("fourth")
                    removeListerens()
                    const current = search.page
                    search.page = 4;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;

          case "five":
            if(search.pageCount() <= 5) {
                  item.style.display = "none"  
            } else if (search.page == search.pageCount() || search.page == (search.pageCount() - 1) || search.page == (search.pageCount() - 2) || search.page == (search.pageCount() - 3)) {
                item.textContent = search.pageCount() - 2
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("six")
                    removeListerens()
                    const current = search.page
                    search.page = search.pageCount() - 2;
                    search.fetchData(false, false, false, true)
                })
            } else if (search.page == (search.pageCount() - 2)) {
                item.textContent = search.pageCount() - 2
                item.style = ""  
            } else if (search.page >= 5) {
                item.style = ""  
                item.textContent = parseInt(search.page) + 1

                item.addEventListener("click", (e) => {
                    console.log("second")
                    removeListerens()
                    const current = search.page
                    console.log(current)
                    search.page = parseInt(current) + 1;
                    search.fetchData(false, false, false, true)
                })
            } else {
                item.textContent = "5"
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("fourth")
                    removeListerens()
                    const current = search.page
                    search.page = 5;
                    search.fetchData(false, false, false, true)
                }) 
            }
          break;

          case "six":
              if(search.pageCount() <= 6) {
                item.style.display = "none"  
              } else if (search.pageCount() == search.page) {
                item.style = ""
                item.textContent = search.page - 1
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("fourth")
                    removeListerens()
                    const current = search.page
                    search.page = search.pageCount() - 1;
                    search.fetchData(false, false, false, true)
                }) 
            } else if (search.page == (search.pageCount() - 2) || search.page == (search.pageCount() - 3)) {
                item.textContent = search.pageCount() - 1
                item.style = ""  
                item.removeAttribute("disabled")
                item.addEventListener("click", (e) => {
                    console.log("six")
                    removeListerens()
                    const current = search.page
                    search.page = search.pageCount() - 1;
                    search.fetchData(false, false, false, true)
                }) 
              } else if (search.page == (search.pageCount() - 1)) {
                item.textContent = search.pageCount() - 1
                item.style = ""  
              } else {
                item.style = ""  
                item.textContent = "..."
                } 
            break;

 
        case "last":
            if(search.pageCount() <= 7) {
                item.style.display = "none"   
            } else {
                item.style = ""
                item.addEventListener("click", (e) => {
                    removeListerens()
                    const current = search.pageCount()
                    search.page = current;
                    search.fetchData(false, false, false, true)
                })
            }


            item.textContent = search.pageCount()
          break;
        
    }
}