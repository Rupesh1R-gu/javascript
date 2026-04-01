@@ -0,0 +1,104 @@
const container = document.getElementById("productContainer");
const loader = document.getElementById("loader");
const error = document.getElementById("error");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

const lowHighBtn = document.getElementById("lowHigh");
const highLowBtn = document.getElementById("highLow");

let products = [];
let filteredProducts = [];

// Fetch Data
async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("API Failed");

    products = await res.json();
    filteredProducts = [...products];

    loader.style.display = "none";
    displayProducts(filteredProducts);

  } catch (err) {
    loader.style.display = "none";
    error.textContent = "Error loading data";
  }
}

// Display Products
function displayProducts(data) {
  container.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" />
      <h4>${p.title.substring(0, 20)}...</h4>
      <p>${p.description.substring(0, 60)}...</p>
      <button class="price-btn">$${p.price}</button>
      <br/><br/>
      <button class="view-btn" data-id="${p.id}">View More</button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => viewDetails(btn.dataset.id));
  });
}

// Search 
// Category Filter
function filterData() {
  const search = searchInput.value.toLowerCase();
  const category = categorySelect.value;

  filteredProducts = products.filter(p => {
    return (
      p.title.toLowerCase().includes(search) &&
      (category === "" || p.category === category)
    );
  });

  displayProducts(filteredProducts);
}

// Sorting
lowHighBtn.addEventListener("click", () => {
  filteredProducts.sort((a, b) => a.price - b.price);
  displayProducts(filteredProducts);
});

highLowBtn.addEventListener("click", () => {
  filteredProducts.sort((a, b) => b.price - a.price);
  displayProducts(filteredProducts);
});

// Modal Logic
function viewDetails(id) {
  const product = products.find(p => p.id == id);

  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalPrice").textContent = "$" + product.price;

  document.getElementById("modal").style.display = "flex";
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});


searchInput.addEventListener("input", filterData);
categorySelect.addEventListener("change", filterData);


fetchProducts();