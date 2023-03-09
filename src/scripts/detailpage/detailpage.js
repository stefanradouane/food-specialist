import {getData} from '../api/getdata'
import {setUrl} from '../url/url'
import {flag} from 'country-emoji' // Only library used to prevent a lot of time making a dictionary for all the country flags

export const detailPage = async (itemId, search, popState) => {
    // If page is loaded set url.
    if(!popState){
        setUrl(search, itemId)
    }

    // Fetch detailpage data
    const productInfo = await getData("detail", itemId)
    
    // Select elements
    const detailPage = document.querySelector(".detailpage")
    const detailPageTitle = document.querySelector(".detailpage__title")
    const detailPageBrand = document.querySelector(".detailpage__brand")
    const detailPageImage = document.querySelector(".detailpage__image")
    const detailPageIngredients = document.querySelector(".detailpage__ingredients")
    const detailPageCountries = document.querySelector(".detailpage__countries")
    const detailPageTable = document.querySelector(".detailpage__table")
    const detailPageQuantity = document.querySelector(".detailpage__quantity")
    const detailPageNutriscore = document.querySelector(".detailpage__nutriscore")
    const detailPageNovaScore = document.querySelector(".detailpage__novascore")
    const detailPageEcoScore = document.querySelector(".detailpage__ecoscore")
    const detailPageProtein = document.querySelector(".detailpage__protein-score")
    const detailPageAllergens = document.querySelector(".detailpage__allergens")
    const detailPageBarcode = document.querySelector(".detailpage__barcode")

    // If product found
    if(productInfo) {
        const product = productInfo.product
        // make page
        detailPage.ariaExpanded = "true"
        detailPageTitle.textContent = product?.product_name
        detailPageBrand.textContent = product.brands
        detailPageImage.src = product.image_front_url ? product.image_front_url : "public/assets/images/eaten-apple.png"
        detailPageQuantity.textContent = product.quantity
        detailPageIngredients.textContent = product.ingredients_text_nl ? product.ingredients_text_nl : product.ingredients_text_en ? product.ingredients_text_en : product.ingredients_text
        detailPageAllergens.textContent = allergieList(product.allergens_hierarchy)
        detailPageCountries.textContent = "Product wordt verkocht in: ";
        detailPageCountries.appendChild(countryList(product.countries_hierarchy))
        detailPageNutriscore.src = `https://static.openfoodfacts.org/images/attributes/nutriscore-${product.nutriscore_grade ? product.nutriscore_grade : "unknown"}.svg`
        detailPageNovaScore.src = `https://static.openfoodfacts.org/images/attributes/nova-group-${product.nova_group ? product.nova_group : "unknown"}.svg`
        detailPageEcoScore.src = `https://static.openfoodfacts.org/images/attributes/ecoscore-${product.ecoscore_grade ? product.ecoscore_grade : "unknown"}.svg`

        // Make alergie list
        function allergieList (list) {
            let returnedValue = "Allergenen: ";
            if(list.length == 0){
                returnedValue += "Geen"
            } else {  
                list.forEach((item, i, all) => {
                    const words = item.split(":");
                    if((all.length - 1) == i){
                        returnedValue += String(words[1])[0].toUpperCase() + String(words[1]).substr(1);                    
                    } else if((all.length - 2) == i){
                        returnedValue += String(words[1])[0].toUpperCase() + String(words[1]).substr(1) + " " + "&"  + " ";                    
                    } else {
                        returnedValue += String(words[1])[0].toUpperCase() + String(words[1]).substr(1) + ","  + " ";
                    }
                })
            }
            return returnedValue
        }

        // Make an emoji list for the countries
        function countryList (list) {
            let returnedObject = document.createElement("span");

            list.forEach((item,) => {
                const words = item.split(":")
                if(words[1].includes("-")){
                    // Only library :)
                    const countryFlag = flag(words[1].replaceAll("-", " "));
                    returnedObject.textContent += countryFlag + " "
                } else {
                    const countryFlag = flag(words[1]);
                    returnedObject.textContent += countryFlag + " "
                }
            })
            return returnedObject

        }

        // Show barcode
        detailPageBarcode.textContent = "Barcode: " +  `${product._id ? product._id : "Onbekend"}`


        // Set protein icon
        if(isNaN(product.nutriments.proteins_100g)){
            detailPageProtein.textContent = "Eiwitten onbekend"
        } else {
            detailPageProtein.textContent = `${product.nutriments.proteins_100g}${product.nutriments.proteins_unit} eiwitten / 100${product.nutriments.proteins_unit}`
        }

        
        // Make nutriments table
        const nutrimentsTable = () => {
            if(!product.nutriments){
                return 
            }

            const tableBody = document.createElement("tbody")
            const firstRow = document.createElement("tr")
            const firstRowItem1 = document.createElement("td");
            firstRowItem1.textContent = "Voedingswaarden"
            const firstRowItem2 = document.createElement("td");
            firstRowItem2.textContent = "100g"
            const firstRowItem3 = document.createElement("td");
            firstRowItem3.textContent = product.serving_size;
            
            if(!product.serving_size){
                firstRowItem3.style.display = "none"      
            }

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
                
                // Switch for the nutriment table
                switch (nutriment) {
                    case "Energie":
                        if(!isNaN(product.nutriments["energy-kj_100g"]) || !isNaN(product.nutriments.energy)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments["energy-kj_100g"] ? product.nutriments["energy-kj_100g"] : product.nutriments.energy} ${product.nutriments["energy-kj_unit"] ? product.nutriments["energy-kj_unit"] : "kJ"} / ${product.nutriments["energy-kcal_100g"]} ${product.nutriments["energy-kcal_unit"]}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }
                        if(!isNaN(product.nutriments["energy-kj_serving"]) || product.nutriments.energy_serving){
                            tableItem3.textContent = `${product.nutriments["energy-kj_serving"] ? product.nutriments["energy-kj_serving"] : product.nutriments.energy_serving} ${product.nutriments["energy-kj_unit"] ? product.nutriments["energy-kj_unit"] : "kJ"} / ${product.nutriments["energy-kcal_serving"]} ${product.nutriments["energy-kcal_unit"]}`
                        } else{
                            tableItem3.style.display = "none";
                        }
                        
                        break;
                    case "Vetten":
                        if(!isNaN(product.nutriments.fat_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.fat_100g} ${product.nutriments.fat_unit}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }

                        if(!isNaN(product.nutriments.fat_serving)){
                            tableItem3.textContent = `${product.nutriments.fat_serving} ${product.nutriments.fat_unit}`
                        } else{
                            tableItem3.style.display = "none";
                        }
                        
                        break;
                    case "Koolhydraten":
                        if(!isNaN(product.nutriments.carbohydrates_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.carbohydrates_100g} ${product.nutriments.carbohydrates_unit}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }
                        if(!isNaN(product.nutriments.carbohydrates_serving)) {
                            tableItem3.textContent = `${product.nutriments.carbohydrates_serving} ${product.nutriments.carbohydrates_unit}`
                        } else{
                            tableItem3.style.display = "none";
                        }
                        
                        break;
                    case "Suiker":
                        if(!isNaN(product.nutriments.sugars_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.sugars_100g} ${product.nutriments.sugars_unit}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }

                        if(!isNaN(product.nutriments.sugars_serving)){
                            tableItem3.textContent = `${product.nutriments.sugars_serving} ${product.nutriments.sugars_unit}`
                        } else{
                            tableItem3.style.display = "none";
                        }

                        break;
                    case "Eiwitten":
                        if(!isNaN(product.nutriments.proteins_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.proteins_100g} ${product.nutriments.proteins_unit}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }
                        if(!isNaN(product.nutriments.proteins_serving)){
                            tableItem3.textContent = `${product.nutriments.proteins_serving} ${product.nutriments.proteins_unit}`
                        } else{
                            tableItem3.style.display = "none";
                        }

                        break;
                    case "Zout":
                        if(!isNaN(product.nutriments.salt_100g)){
                            tableItemDefault.textContent = nutriment
                            tableItem2.textContent = `${product.nutriments.salt_100g} ${product.nutriments.salt_unit}`
                        } else{
                            tableItemDefault.style.display = "none";
                            tableItem2.style.display = "none";
                        }
                        if(!isNaN(product.nutriments.salt_serving)){
                            tableItem3.textContent = `${product.nutriments.salt_serving} ${product.nutriments.salt_unit}`  
                        } else{
                            tableItem3.style.display = "none";
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
        if(detailPageTable.children.length >= 1){
            detailPageTable.children[0].remove()
        }

        // Append table
        detailPageTable.appendChild(nutrimentsTable())
    }

    // close detail page
    const control = document.querySelector(".detailpage__control");

    control.addEventListener("click", () => {
        // Clear URL
        setUrl(search);
        if(search){
            search.id = ""
        }
        detailPage.ariaExpanded = "false"
    })
}