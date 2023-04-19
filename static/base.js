const searchInput = document.getElementById('searchInputCustomers');
const searchResults = document.querySelector('.resultBox');
const searchForm = document.querySelector('.searchForm')

searchInput.addEventListener('input', async function(e) {
    e.preventDefault();
  const searchTerm = this.value;    

  const results = await searchDatabase(searchTerm);
  // Clear the search results dropdown
  searchResults.innerHTML = '';

  // If there is user input Populate the search results dropdown with the matching results
  if (this.value) {
    if (results.length > 0) {
        searchResults.style.display = 'block';
        results.forEach(result => {
        const link = document.createElement('a');
        link.href = `/${result.id}`;
        link.textContent = result.fullName;
        searchResults.appendChild(link);
        });
    } else {
        searchResults.style.display = 'none';
    }
} else {
    // hide results window if user deleted all input
    searchResults.style.display = 'none';
}
});

async function searchDatabase(searchTerm) {
    const response = await axios.get("/search", {
        params: {
          q: searchTerm
        }
    })
    return response.data
}

