export const searchResults = (data) => {
    const results = data.map(product => {
        const itemContainer = document.createElement("section");
        itemContainer.classList.add("result")
        itemContainer.dataset.id = product._id

        const itemImage = document.createElement("img");
        itemImage.classList.add("result__image")
        itemImage.src = product.image_front_url ? product.image_front_url : "public/assets/images/eaten-apple.png"

        const item = document.createElement("h2")
        item.classList.add("result__title")
        item.classList.add("title")
        item.classList.add("title--h3")
        item.textContent = product.product_name;

        const itemContent = document.createElement("p")
        itemContent.classList.add("result__info")
        itemContent.textContent = `${product.nutriments.proteins_100g}${product.nutriments.proteins_unit} eiwitten / 100${product.nutriments.proteins_unit}`;

        const itemQuantity = document.createElement("p")
        itemQuantity.classList.add("result__quantity")
        itemQuantity.textContent = `${product?.quantity}`;


        const nutriScore = document.createElement("img")
        nutriScore.classList.add("result__nutriscore")
        nutriScore.src = `https://static.openfoodfacts.org/images/attributes/nutriscore-${product.nutriscore_grade ? product.nutriscore_grade : "unknown"}.svg`

        itemContainer.appendChild(itemImage) 
        itemContainer.appendChild(item) 
        itemContainer.appendChild(itemContent) 
        itemContainer.appendChild(itemQuantity) 
        itemContainer.appendChild(nutriScore) 
        return itemContainer
    })
    return results   
}