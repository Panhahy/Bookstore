
        // Function to show/hide pages and manage active navigation item
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });

            // Show the requested page
            document.getElementById(pageId + '-page').classList.add('active');

            // Update active navigation item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                item.classList.remove('border-b-2', 'border-indigo-600', 'text-indigo-600');
            });
            const activeNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
        }

        // Add event listeners to navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const page = this.getAttribute('data-page');
                showPage(page);
            });
        });

        // Function to filter books by category
        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all category buttons
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active-category', 'bg-indigo-100', 'text-indigo-700');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });

                // Add active class to the clicked button
                this.classList.add('active-category', 'bg-indigo-100', 'text-indigo-700');
                this.classList.remove('bg-gray-100', 'text-gray-700');

                const category = this.getAttribute('data-category');
                const bookCards = document.querySelectorAll('.book-card');

                bookCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex'; // Show card
                    } else {
                        card.style.display = 'none'; // Hide card
                    }
                });
            });
        });

        // Initialize with Home page active
        document.addEventListener('DOMContentLoaded', () => {
            showPage('home');
        });
        document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP & PAGE NAVIGATION ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    const addToCartButtons = document.querySelectorAll('button.bg-indigo-500');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.querySelector('#cart-page .text-2xl.font-extrabold');

    // This array will store all items added to the cart
    let cart = [];

    // Function to switch between pages (Home, Shop, Cart, etc.)
    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) targetPage.classList.add('active');

        const targetNav = document.querySelector(`.nav-item[data-page='${pageId}']`);
        if (targetNav) targetNav.classList.add('active');
    };

    // Add click listeners to navigation links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            showPage(pageId);
        });
    });

    // Make showPage globally available for the inline `onclick` attribute in the HTML
    window.showPage = showPage;


    // --- 2. CART LOGIC ---

    // Function that runs when any "Add to Cart" button is clicked
    const handleAddToCart = (e) => {
        const button = e.target;
        const card = button.closest('.bg-gray-50'); // Finds the parent container of the book
        if (!card) return;

        // Extract book info from the HTML
        const title = card.querySelector('h4').textContent.trim();
        const author = card.querySelector('p').textContent.replace('Author:', '').trim();
        const priceString = card.querySelector('span').textContent.trim();
        const price = parseFloat(priceString.replace('$', ''));
        const imageSrc = card.querySelector('img').src;

        // Check if the book is already in the cart
        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity++; // If yes, just increase the quantity
        } else {
            // If no, add the book as a new object to the cart array
            cart.push({ title, author, price, imageSrc, quantity: 1 });
        }

        // Refresh the cart page with the new data
        updateCartUI();

        // Give user feedback
        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);
    };

    // Function to handle clicks inside the cart (remove, increase/decrease quantity)
    const handleCartAction = (e) => {
        const target = e.target;
        const cartItemDiv = target.closest('.cart-item');
        if (!cartItemDiv) return;

        const title = cartItemDiv.dataset.title;
        const itemIndex = cart.findIndex(item => item.title === title);
        if (itemIndex === -1) return;

        // Check which button was clicked
        if (target.classList.contains('remove-item')) {
            cart.splice(itemIndex, 1); // Remove item from array
        } else if (target.dataset.action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (target.dataset.action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove if quantity reaches 0
            }
        }
        
        updateCartUI(); // Refresh the cart display
    };


    // --- 3. UI UPDATING ---

    // This function redraws the entire cart page based on the `cart` array
    const updateCartUI = () => {
        // Clear the placeholder items
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Your cart is currently empty.</p>';
            subtotalElement.textContent = '$0.00';
            return;
        }

        let subtotal = 0;

        // Loop through each item in the cart array and create its HTML
        cart.forEach(item => {
            subtotal += item.price * item.quantity;

            const itemHTML = `
                <div class="cart-item flex items-center bg-gray-50 p-4 rounded-xl shadow-sm" data-title="${item.title}">
                    <img src="${item.imageSrc}" alt="${item.title}" class="w-20 h-28 object-cover rounded-md mr-4 shadow-sm">
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 text-sm">${item.author}</p>
                        <p class="text-indigo-600 font-bold mt-1">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="quantity-change bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300" data-action="decrease">-</button>
                        <span class="text-lg font-medium">${item.quantity}</span>
                        <button class="quantity-change bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300" data-action="increase">+</button>
                        <button class="remove-item ml-4 text-red-500 hover:text-red-700">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });

        // Update the subtotal price
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    };

    // Attach the `handleAddToCart` function to every "Add to Cart" button
    addToCartButtons.forEach(button => button.addEventListener('click', handleAddToCart));

    // Attach the event listener for actions inside the cart
    cartItemsContainer.addEventListener('click', handleCartAction);
    
    // Initial call to set the cart to its "empty" state on page load
    updateCartUI();
});
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP & PAGE NAVIGATION ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    const addToCartButtons = document.querySelectorAll('button.bg-indigo-500');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.querySelector('#cart-page .text-2xl.font-extrabold');

    let cart = [];

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) targetPage.classList.add('active');

        const targetNav = document.querySelector(`.nav-item[data-page='${pageId}']`);
        if (targetNav) targetNav.classList.add('active');
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            showPage(pageId);
        });
    });

    window.showPage = showPage;

    // --- 2. CART LOGIC ---
    const handleAddToCart = (e) => {
        const button = e.target;
        const card = button.closest('.bg-gray-50');
        if (!card) return;

        const title = card.querySelector('h4').textContent.trim();
        const author = card.querySelector('p').textContent.replace('Author:', '').trim();
        const priceString = card.querySelector('span').textContent.trim();
        const price = parseFloat(priceString.replace('$', ''));
        const imageSrc = card.querySelector('img').src;

        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ title, author, price, imageSrc, quantity: 1 });
        }

        updateCartUI();
        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);
    };

    const handleCartAction = (e) => {
        const target = e.target;
        const cartItemDiv = target.closest('.cart-item');
        if (!cartItemDiv) return;

        const title = cartItemDiv.dataset.title;
        const itemIndex = cart.findIndex(item => item.title === title);
        if (itemIndex === -1) return;

        if (target.classList.contains('remove-item')) {
            cart.splice(itemIndex, 1);
        } else if (target.dataset.action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (target.dataset.action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCartUI();
    };

    // --- 3. UI UPDATING ---
    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Your cart is currently empty.</p>';
            subtotalElement.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item flex items-center bg-gray-50 p-4 rounded-xl shadow-sm" data-title="${item.title}">
                    <img src="${item.imageSrc}" alt="${item.title}" class="w-20 h-28 object-cover rounded-md mr-4 shadow-sm">
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 text-sm">${item.author}</p>
                        <p class="text-indigo-600 font-bold mt-1">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="quantity-change bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300" data-action="decrease">-</button>
                        <span class="text-lg font-medium">${item.quantity}</span>
                        <button class="quantity-change bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300" data-action="increase">+</button>
                        <button class="remove-item ml-4 text-red-500 hover:text-red-700">Remove</button>
                    </div>
                </div>`;
            cartItemsContainer.innerHTML += itemHTML;
        });

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    };

    addToCartButtons.forEach(button => button.addEventListener('click', handleAddToCart));
    cartItemsContainer.addEventListener('click', handleCartAction);
    updateCartUI();

    // --- 4. NEW: SHOP PAGE FILTERING & SEARCH ---
    const searchBar = document.getElementById('search-bar');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const bookCards = document.querySelectorAll('#book-listings .book-card');

    // This single function handles both searching and category filtering
    const filterBooks = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active-category').dataset.category;

        bookCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const author = card.querySelector('p').textContent.toLowerCase();
            const category = card.dataset.category;

            // Check if the card matches the active category and search term
            const categoryMatch = (activeCategory === 'all' || category === activeCategory);
            const searchMatch = (title.includes(searchTerm) || author.includes(searchTerm));

            // Show or hide the card based on the match
            if (categoryMatch && searchMatch) {
                card.style.display = 'flex'; // Use 'flex' because the cards are flex containers
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Add event listener to the search bar to filter as the user types
    searchBar.addEventListener('input', filterBooks);

    // Add event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // First, remove active styles from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('active-category', 'bg-indigo-100', 'text-indigo-700');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });

            // Then, add active styles to the clicked button
            button.classList.add('active-category', 'bg-indigo-100', 'text-indigo-700');
            button.classList.remove('bg-gray-100', 'text-gray-700');
            
            // Run the filter function to update the displayed books
            filterBooks();
        });
    });
});