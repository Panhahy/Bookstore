
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