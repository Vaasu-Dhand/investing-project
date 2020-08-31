// General Script
// console.log(window.location.pathname);
// List.js

// / route
if (window.location.pathname == '/') { 
  // Typed.js
  window.onload = function() {
    new Typed('#typed', {
      stringsElement: '#typed-strings',
      typeSpeed: 50,
      loop: true,
      startDelay: 500
    });
  }
}

// /list route
if (window.location.pathname == '/list') {
  // Redirecting to Category path: '/list?category=web' 
  function redirectToCategory(category, btn) {
    window.location = `?page=1&category=${category}`
    // btn.classList.add('active');  // Add a functionality to get colored butonn
  }
  
  function valueSearch(e, element) {
    e.preventDefault();
    const search = element.childNodes[1].value; 
    window.location = `${window.location.origin}${window.location.pathname}?page=1&search=${search}`;
  }
}

// /list/:id route


