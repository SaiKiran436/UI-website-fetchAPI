document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://dummyjson.com/products';
    const cardContainer = document.getElementById('cardContainer');
    const searchBar = document.getElementById('searchBar');

    // Fetch items from API
    async function fetchItems() {
        try {
            const response = await fetch(API_URL);
            const { products } = await response.json();
            renderCards(products);

            // Render locally stored items after API items
            const storedItems = JSON.parse(localStorage.getItem('items')) || [];
            renderCards(storedItems);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // Render cards dynamically
    function renderCards(items) {
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card" style="filter: drop-shadow(0px 0px 12px grey);border-radius: 20px;">
                    <img src="${item.thumbnail || item.image}" class="card-img-top" alt="${item.title || item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title || item.name}</h5>
                        <p class="card-text text-muted">${item.description}</p>
                        <p class="card-text text-success fw-bold">$${item.price || ''}</p>
                        <button class="btn btn-outline btn-success" type="button">Buy</button>
                    </div>
                   
                </div>
            `;
            cardContainer.appendChild(card);
        });
    }

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allCards = cardContainer.getElementsByClassName('card');

        Array.from(allCards).forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.parentElement.style.display = '';
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    });

    // Form submission to add new items
    const itemForm = document.getElementById('itemForm');
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('itemName').value;
        const description = document.getElementById('itemDescription').value;
        const thumbnail = document.getElementById('itemImage').value;
        const price = document.getElementById('itemPrice').value;

        const newItem = { title, description, thumbnail, price };

        // Save to localStorage
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        storedItems.push(newItem);
        localStorage.setItem('items', JSON.stringify(storedItems));

        // Append new card
        renderCards([newItem]);

        // Clear form inputs
        itemForm.reset();
    });

    // Initial fetch and render
    fetchItems();
});
