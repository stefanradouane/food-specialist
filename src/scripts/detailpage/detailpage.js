export const detailPage = async (itemId) => {
    console.log(itemId)


    const detailModal = document.querySelector(".detailpage")

    const detailModalImage = document.querySelector(".detailpage__image")

    const detailModalTitle = document.querySelector(".detailpage__title")

    const detailModalProtein = document.querySelector(".detailpage__protein")
    const productIngredients = document.querySelector(".detailpage__ingredients")

    const productTable = document.querySelector(".detailpage__table")
    const productQuantity = document.querySelector(".detailpage__quantity")

    const fetchDetailPage = async () => {
        const response = fetch(`https://nl.openfoodfacts.org/api/v0/product/${itemId}.json`)
        // console.log(await response)
        const detailData = await response;
        if (!detailData.ok) {
            throw new Error("Network response was not ok");
        }

        return detailData.json()
    }

    const productInfo = await fetchDetailPage()

    console.log(productInfo)

    if(productInfo) {
        const product = productInfo.product
        detailModal.ariaExpanded = "true"
        detailModalTitle.textContent = product.product_name
        productQuantity.textContent = product.quantity
        detailModalImage.src = product.image_front_url ? product.image_front_url : "public/assets/images/eaten-apple.png"
        // detailModalProtein.textContent = `Proteine ${productInfo.product.nutriments.proteins}${productInfo.product.nutriments.proteins_unit} Totaal, ${productInfo.product.nutriments.proteins_100g}${productInfo.product.nutriments.proteins_unit} / 100${productInfo.product.nutriments.proteins_unit}`;

        // product information fallback as following: nl, en & default
        productIngredients.textContent = product.ingredients_text_nl ? product.ingredients_text_nl : product.ingredients_text_en ? product.ingredients_text_en : product.ingredients_text


        
        const nutrimentsTable = () => {
            if(!product.nutriments){
                return 
            }

            const tableBody = document.createElement("tbody")
            let tableHeaderRow = document.createElement("tr");
            let tableHeader = document.createElement("th");

            tableHeader.textContent = "Voedingswaarden";
            tableHeader.setAttribute("colspan", "3")
            tableHeaderRow.appendChild(tableHeader)
            tableBody.appendChild(tableHeaderRow)

            const firstRow = document.createElement("tr")
            const firstRowItem1 = document.createElement("td");
            firstRowItem1.textContent = "Per"
            const firstRowItem2 = document.createElement("td");
            firstRowItem2.textContent = "100g"
            const firstRowItem3 = document.createElement("td");
            firstRowItem3.textContent = product.serving_size;        

            firstRow.appendChild(firstRowItem1)
            firstRow.appendChild(firstRowItem2)
            firstRow.appendChild(firstRowItem3)

            tableBody.appendChild(firstRow)

            let nutriments = ["Energie", "Vetten", "Koolhydraten", "Suiker", "Eiwitten", "Zout"]
            
            nutriments.map((nutriment, i) => {
                const tableRowDefault = document.createElement("tr");
                const tableItemDefault = document.createElement("td");
                
                const tableItem2 = document.createElement("td");
                const tableItem3 = document.createElement("td");
                
                if(!product.serving_size) {
                    tableItem3.style.display = "none"                    
                }
                
                switch (nutriment) {
                    case "Energie":
                        if(!isNaN(product.nutriments["energy-kj_100g"]) || !isNaN(product.nutriments.energy)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments["energy-kj_100g"] ? product.nutriments["energy-kj_100g"] : product.nutriments.energy} ${product.nutriments["energy-kj_unit"] ? product.nutriments["energy-kj_unit"] : "kJ"} / ${product.nutriments["energy-kcal_100g"]} ${product.nutriments["energy-kcal_unit"]}`
                        }
                        if(!isNaN(product.nutriments["energy-kj_serving"]) || product.nutriments.energy_serving){
                            tableItem3.textContent = `${product.nutriments["energy-kj_serving"] ? product.nutriments["energy-kj_serving"] : product.nutriments.energy_serving} ${product.nutriments["energy-kj_unit"] ? product.nutriments["energy-kj_unit"] : "kJ"} / ${product.nutriments["energy-kcal_serving"]} ${product.nutriments["energy-kcal_unit"]}`
                        }
                        
                        break;
                    case "Vetten":
                        if(!isNaN(product.nutriments.fat_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.fat_100g} ${product.nutriments.fat_unit}`
                        }
                        if(!isNaN(product.nutriments.fat_serving)){
                            tableItem3.textContent = `${product.nutriments.fat_serving} ${product.nutriments.fat_unit}`
                        }
                        
                        break;
                    case "Koolhydraten":
                        if(!isNaN(product.nutriments.carbohydrates_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.carbohydrates_100g} ${product.nutriments.carbohydrates_unit}`
                        }
                        if(!isNaN(product.nutriments.carbohydrates_serving)) {
                            tableItem3.textContent = `${product.nutriments.carbohydrates_serving} ${product.nutriments.carbohydrates_unit}`
                        }
                        
                        break;
                    case "Suiker":
                        if(!isNaN(product.nutriments.sugars_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.sugars_100g} ${product.nutriments.sugars_unit}`
                        }

                        if(!isNaN(product.nutriments.sugars_serving)){
                            tableItem3.textContent = `${product.nutriments.sugars_serving} ${product.nutriments.sugars_unit}`
                        }

                        break;
                    case "Eiwitten":
                        if(!isNaN(product.nutriments.proteins_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.proteins_100g} ${product.nutriments.proteins_unit}`
                        }
                        if(!isNaN(product.nutriments.proteins_serving)){
                            tableItem3.textContent = `${product.nutriments.proteins_serving} ${product.nutriments.proteins_unit}`
                        }

                        break;
                    case "Zout":
                        if(!isNaN(product.nutriments.salt_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.salt_100g} ${product.nutriments.salt_unit}`
                        }
                        if(!isNaN(product.nutriments.salt_serving)){
                            tableItem3.textContent = `${product.nutriments.salt_serving} ${product.nutriments.salt_unit}`  
                        }

                        break;
                }
                
                tableRowDefault.appendChild(tableItemDefault);
                tableRowDefault.appendChild(tableItem2);
                tableRowDefault.appendChild(tableItem3);
                
                tableBody.appendChild(tableRowDefault)
            })



            return tableBody
        }

        // Reset table
        if(productTable.children.length >= 1){
            productTable.children[0].remove()
        }

        productTable.appendChild(nutrimentsTable())


        // detailModalTable.
    }


    // console.log(this.detailModal())
    const control = document.querySelector(".detailpage__control");
    // const detailModal = document.querySelector(".detailpage");
    
    control.addEventListener("click", () => {
        detailModal.ariaExpanded = "false"
    })
}