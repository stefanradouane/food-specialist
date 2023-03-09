/**
 * @param {Array} data
 * An array of all the objects send by the Open Food API.
 * These objects are conveted to a HTML search result section. 
 * 
 * @returns {Array} of elements
 * Each item contains a:
 * Productname
 * Image
 * Nutriscore
 * Proteinsection
 */

export const searchResults = (data) => {
    const results = data.map(product => {
        // Create the item container with the className "result" and a data-id of the "product-id"
        const itemContainer = document.createElement("section");
        itemContainer.classList.add("result")
        itemContainer.dataset.id = product._id
        
        // Create all elements
        const resultName = document.createElement("h2")
        const resultImg = document.createElement("img");
        const resultNutriScore = document.createElement("img")
        const resultProteinSection = document.createElement("section")

        // Add classes and set textContent or image.src
        // Productname
        resultName.classList.add("result__title")
        resultName.classList.add("title")
        resultName.classList.add("title--h3")
        resultName.textContent = product.product_name;

        // Image
        resultImg.classList.add("result__image")
        resultImg.setAttribute("loading", "lazy")
        resultImg.src = product.image_front_url ? product.image_front_url : "public/assets/images/eaten-apple.png"

        // Nutriscore
        resultNutriScore.classList.add("result__nutriscore")
        resultNutriScore.src = `https://static.openfoodfacts.org/images/attributes/nutriscore-${product.nutriscore_grade ? product.nutriscore_grade : "unknown"}.svg`

        // Proteinsection
        resultProteinSection.classList.add("result__protein")
        
        // Make protein section        
        const proteinIcon = document.createElement("img")
        proteinIcon.src = "public/assets/images/protein.png"
        proteinIcon.classList.add("result__protein-image")
        
        const proteinText = document.createElement("p")
        if(isNaN(product.nutriments.proteins_100g)){
            proteinText.textContent = "Eiwitten onbekend"
        } else {
            proteinText.textContent = `${Math.round(product.nutriments.proteins_100g * 10) / 10}${product.nutriments.proteins_unit} eiwitten / 100${product.nutriments.proteins_unit}`
        }
        proteinText.classList.add("result__protein-score")
        
        // Append protein section elements
        resultProteinSection.appendChild(proteinIcon)
        resultProteinSection.appendChild(proteinText)

        // Append all elements  
        itemContainer.appendChild(resultName) 
        // itemContainer.appendChild(resultQuantity) 
        itemContainer.appendChild(resultImg) 
        itemContainer.appendChild(resultProteinSection) 
        itemContainer.appendChild(resultNutriScore) 
        return itemContainer
    })

    return results   
}