const homeDialog = document.querySelector(".home")
const cta = document.querySelector(".cta--home")

cta.addEventListener("click", e => {
    homeDialog.ariaExpanded = false
})