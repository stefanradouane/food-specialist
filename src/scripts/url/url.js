export const updateUrl = () => {
    window.onpopstate = (event) => {
        alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
      }
};