class Product {
  constructor(id, model, description, special, color, func, resolution, img) {
    this.id = id;
    this.model = model;
    this.description = description;
    this.special = special;
    this.color = color;
    this.func = func;
    this.resolution = resolution;
    this.img = img;
  }

  getCard() {
    return `
      <div class="m-3 rounded">
          <div class="flip-card">
              <div class="flip-card-inner">
                  <div class="flip-card-front">
                      <img src="${this.img}" alt="Image" style="width:300px;height:500px;">
                  </div>
                  <div class="flip-card-back">
                      <h1 id="model">${this.model}</h1><br>
                      <p id="description">${this.description}</p>
                      <p id="special">${this.special}</p>
                      <p id="color">${this.color}</p>
                      <p id="func">${this.func}</p>
                      <p id="resolution">${this.resolution}</p>
                  </div>
              </div>
           </div>
      </div>
      `;
  }
}

class Evidence {
  constructor() {
    this.products = [];
    this.loadData();
  }

  // Add product to the list
  addProduct(product) {
    this.products.push(product);
  }

  // Load data from JSON files
  loadData() {
    let self = this;
    const urls = [
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/videx.json",
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/bticino.json",
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/cipy.json",
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/kamery.json",
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/zamky.json",
    ];

    // Loop through each URL and load data
    urls.forEach((url) => {
      $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
          const category = Object.keys(data)[0];
          data[category].forEach((product) => {
            self.addProduct(
              new Product(
                product.id,
                product.model,
                product.description,
                product.special,
                product.color,
                product.func,
                product.resolution,
                product.img
              )
            );
          });
          // After loading data, print products

          self.printProducts();
        },
        error: function () {
          alert("Error with connection to website");
        },
      });
    });
  }

  // Print products on the webpage
  printProducts() {
    let html = "";
    this.products.forEach((product) => {
      html += product.getCard();
    });
    let productElement = document.getElementById("produkty");
    if (productElement) {
      productElement.innerHTML = html;
    } else {
      console.error("Element with ID 'produkty' not found.");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const evidence = new Evidence();
});
