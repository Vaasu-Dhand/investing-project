// General Script
function addActiveClass(page) {
  const element = document.querySelector(`#nav-${page}`);
  element.classList.add('active')
}

// * / route
if (window.location.pathname == '/') { 
  window.onload = function() {
    addActiveClass('home')

    // Typed.js
    new Typed('#typed', {
      stringsElement: '#typed-strings',
      typeSpeed: 50,
      loop: true,
      startDelay: 500
    });
  }
}

// * /list route
if (window.location.pathname == '/list') {
  // Redirecting to Category path: '/list?category=web' 
  function redirectToCategory(category, btn) {
    window.location = `?page=1&category=${category}`
  }
  
  function valueSearch(e, element) {
    e.preventDefault();
    const search = element.childNodes[1].value; 
    window.location = `${window.location.origin}${window.location.pathname}?page=1&search=${search}`;
  }
  
  window.onload = function () { 
    addActiveClass('list')

    // 1st Way - Get paginationElement from data-attributes in HTML
    // Adds 'active' class to the current page number pagination
    const element = document.querySelector('#pagination-ul');
    const currentPageNumber = element.dataset.currentPage;
    const currentLi = document.querySelector(`#pagination-li-${currentPageNumber}`)
    currentLi.classList.add('active')
    
    // 2nd Way - Get category from the url (query parameter)
    // Adds 'active' class to the category button
    const params = (new URL(document.location)).searchParams; // ? Difference b/w window and document object
    const category = params.get("category");
    const selectedCategory = document.querySelector(`#button-group-${category}`)
    if (category) { // if no category selected
      selectedCategory.classList.add('active')
    }
  }
}

// * /register route
if (window.location.pathname == '/register') {
 window.onload = function () {
  addActiveClass('register')
 }
}

