const rootContainer = document.querySelector("#root");
const productContainer = document.querySelector(".product-container");
const url = "https://devbazar.herokuapp.com/products";
let products = [];

//filters
const sortByFilter = document.querySelector("#sortByFilter");
const searchBox = document.querySelector(".search-input");
const sizesFilter = document.querySelector("#sizes-filter");
const filters = {
  sortBy: "",
  searchValue: "",
  sizes: [],
};

//fetching the data
const fetchProducts = async () => {
  const res = await axios.get(url);
  const { data } = res;
  products = data?.response ?? [];
  renderProducts(products);
};

function renderProducts(productItems = []) {
  productContainer.innerHTML = "";
  if (productItems.length === 0) {
    productContainer.innerHTML = `<h1>No products available</h1>`;
  } else {
    productItems.forEach((value) => {
      productContainer.innerHTML += `<div class="product-card">
                <img src=${value.attributes.img} alt="product image" loading="lazy" />
                <span class="name">${value.name}</span>
                <div class="size-details">
                Sizes:
                ${value.attributes.sizes.map(
                  (size) => `
                <span>${size}</span>`
                )}
                </div>
                <span class="price">₹ ${value.price}</span>
            </div>`;
    });
  }
}

//applying filters
const applyAllFilters = () => {
  let tempProducts = [...products];

  if (filters.searchValue.length > 0) {
    tempProducts = tempProducts.filter(({ name }) => {
      return name.toLowerCase().includes(filters.searchValue.toLowerCase());
    });
  }

  if (filters.sortBy === "l-t-h") {
    tempProducts = tempProducts.sort((a, b) => a.price - b.price);
  }

  if (filters.sortBy === "h-t-l") {
    tempProducts = tempProducts.sort((a, b) => b.price - a.price);
  }

  if (filters.sizes.length > 0) {
    tempProducts = tempProducts.filter(
      ({ attributes }) =>
        filters.sizes.filter((size) => attributes.sizes.includes(size)).length >
        0
    );
  }

  renderProducts(tempProducts);
};

//adding event listeners
sortByFilter.addEventListener("change", function applySortByFilter(event) {
  filters.sortBy = event.target.value;
  applyAllFilters();
});

searchBox.addEventListener("input", function applySearchFilter(event) {
  filters.searchValue = event.target.value;
  applyAllFilters();
});

sizesFilter.addEventListener("change", function applySizeFilter(event) {
  const index = filters.sizes.indexOf(event.target.value);
  if (index >= 0) {
    filters.sizes.splice(index, 1);
  } else {
    filters.sizes.push(event.target.value);
  }
  applyAllFilters();
});

fetchProducts();
