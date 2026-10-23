const categoryData = [
  { name: "Women", emoji: "👗", color: "#fbe3f2", category: "Women" },
  { name: "Men", emoji: "🧥", color: "#d7f7e8", category: "Men" },
  { name: "Designer", emoji: "👜", color: "#fff2bf", category: "Designer" },
  { name: "Kids", emoji: "🐰", color: "#ffead7", category: "Kids" },
  { name: "Home", emoji: "💡", color: "#ffe1e5", category: "Home" },
  { name: "Electronics", emoji: "📱", color: "#c9f8f0", category: "Electronics" },
  { name: "Books & Media", emoji: "📚", color: "#d9efff", category: "Books & Media" },
  { name: "Watches", emoji: "⌚", color: "#f0e0ff", category: "Watches" },
  { name: "Sports", emoji: "🏓", color: "#e8f9b9", category: "Sports" },
  { name: "Tools & Others", emoji: "🛍️", color: "#e9e8dc", category: "Tools & Others" }
];

let products = [
  { id: 1, name: "Olive Utility Vest", price: 280, category: "Women", image: "https://placehold.co/500x620/e2dfd2/344437?text=Olive+Vest", date: 8 },
  { id: 2, name: "Classic Brown Shoulder Bag", price: 350, category: "Designer", image: "https://placehold.co/500x620/d7c5b1/344437?text=Shoulder+Bag", date: 7 },
  { id: 3, name: "Vintage Graphic Tee", price: 150, category: "Men", image: "https://placehold.co/500x620/e4ded3/344437?text=Graphic+Tee", date: 6 },
  { id: 4, name: "Everyday Digital Watch", price: 420, category: "Watches", image: "https://placehold.co/500x620/d4d8d2/344437?text=Digital+Watch", date: 5 },
  { id: 5, name: "Preloved Denim Jacket", price: 390, category: "Women", image: "https://placehold.co/500x620/cdd9dd/344437?text=Denim+Jacket", date: 4 },
  { id: 6, name: "Everyday Backpack", price: 220, category: "Tools & Others", image: "https://placehold.co/500x620/e8dfcd/344437?text=Backpack", date: 3 },
  { id: 7, name: "Classic White Sneakers", price: 450, category: "Sports", image: "https://placehold.co/500x620/eeeeea/344437?text=Sneakers", date: 2 },
  { id: 8, name: "Secondhand Novel Set", price: 130, category: "Books & Media", image: "https://placehold.co/500x620/d7e1cf/344437?text=Books", date: 1 }
];

let selectedCategory = "All";
let favorites = new Set();
let nextId = 9;

const categoryGrid = document.getElementById("categoryGrid");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function showPage(pageName) {
  const page = document.getElementById(pageName);
  if (!page) return;

  document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
  page.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  document.getElementById("desktopNav").classList.remove("open");
  document.getElementById("menuButton").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageName === "browse") renderProducts();
}

document.addEventListener("click", event => {
  const navButton = event.target.closest("[data-page]");
  if (navButton) {
    event.preventDefault();
    showPage(navButton.dataset.page);
  }
});

function renderCategories() {
  categoryGrid.innerHTML = categoryData.map(category => `
    <button class="category-card" data-category="${category.category}">
      <span>${category.name}</span>
      <span class="category-emoji" style="background:${category.color}">${category.emoji}</span>
    </button>
  `).join("");
}

function productCard(product) {
  const liked = favorites.has(product.id);
  return `
    <article class="listing-card">
      <div class="listing-image">
        <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}" loading="lazy">
        <button class="like-button" data-favorite="${product.id}" aria-label="${liked ? "Remove from" : "Add to"} favorites">${liked ? "♥" : "♡"}</button>
      </div>
      <div class="listing-info">
        <h3>${escapeHTML(product.name)}</h3>
        <div class="listing-meta">
          <span class="listing-price">₱${Number(product.price).toLocaleString("en-PH")}</span>
          <span class="listing-category">${escapeHTML(product.category)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let filtered = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (sortSelect.value === "low") filtered.sort((a, b) => a.price - b.price);
  else if (sortSelect.value === "high") filtered.sort((a, b) => b.price - a.price);
  else filtered.sort((a, b) => b.date - a.date);

  productGrid.innerHTML = filtered.map(productCard).join("");
  document.getElementById("resultCount").textContent = `${filtered.length} items`;
  document.getElementById("emptyMessage").hidden = filtered.length > 0;
}

function renderFeatured() {
  document.getElementById("featuredGrid").innerHTML = products.slice(0, 4).map(productCard).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function escapeAttribute(value) {
  return escapeHTML(value);
}

categoryGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  searchInput.value = "";
  showPage("browse");
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (!favoriteButton) return;
  const id = Number(favoriteButton.dataset.favorite);
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast("Removed from favorites");
  } else {
    favorites.add(id);
    showToast("Added to favorites");
  }
  renderProducts();
  renderFeatured();
});

document.getElementById("menuButton").addEventListener("click", () => {
  const nav = document.getElementById("desktopNav");
  const open = nav.classList.toggle("open");
  document.getElementById("menuButton").setAttribute("aria-expanded", String(open));
});

document.getElementById("sellForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const price = Number(document.getElementById("itemPrice").value);
  const category = document.getElementById("itemCategory").value;
  const image = document.getElementById("itemImage").value.trim();

  if (!name || !Number.isFinite(price) || price <= 0) {
    showToast("Please enter a valid item name and price.");
    return;
  }

  products.unshift({
    id: nextId++,
    name,
    price,
    category,
    image: image || "https://placehold.co/500x620/e2dfd2/344437?text=New+Listing",
    date: Date.now()
  });

  event.target.reset();
  renderProducts();
  renderFeatured();
  showToast("Demo listing added!");
  showPage("browse");
});

document.getElementById("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("profileName").value.trim();
  showToast(`Welcome, ${name}! Account creation is demo-only.`);
});

renderCategories();
renderProducts();
renderFeatured();
