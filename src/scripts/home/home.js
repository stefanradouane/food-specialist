const homeDialog = document.querySelector(".home")
const cta = document.querySelector(".cta--home")

// Close home
cta.addEventListener("click", e => {
    homeDialog.ariaExpanded = false
})