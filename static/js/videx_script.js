class Evidence_of_videx {
  constructor() {
    this.videx = [];
    this.loadData();
  }

  // Add product to the list
  addVidex(product) {
    this.videx.push(product);
  }

  // Load data from JSON files
  loadData() {
    let self = this;
    const url = [
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/videx.json",
    ];

    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        const category = Object.keys(data)[0];
        data[category].forEach((product) => {
          self.addVidex(
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

        self.printVidex();
      },
      error: function () {
        alert("Error with connection to website");
      },
    });
  }

  // Print products on the webpage
  printVidex() {
    let html = "";
    this.videx.forEach((product) => {
      html += product.getCard();
    });
    let productElement = document.getElementById("videx");
    if (productElement) {
      productElement.innerHTML = html;
    } else {
      console.error("Element with ID 'produkty' not found.");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const evidence = new Evidence_of_videx();
});
