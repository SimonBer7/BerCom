class Evidence_of_cameras {
  constructor() {
    this.cameras = [];
    this.loadData();
  }

  // Add product to the list
  addCamera(product) {
    this.cameras.push(product);
  }

  // Load data from JSON files
  loadData() {
    let self = this;
    const url = [
      "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/kamery.json",
    ];

    // Loop through each URL and load data

    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        const category = Object.keys(data)[0];
        data[category].forEach((product) => {
          self.addCamera(
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

        self.printCameras();
      },
      error: function () {
        alert("Error with connection to website");
      },
    });
  }

  // Print products on the webpage
  printCameras() {
    let html = "";
    this.cameras.forEach((product) => {
      html += product.getCard();
    });
    let productElement = document.getElementById("cameras");
    if (productElement) {
      productElement.innerHTML = html;
    } else {
      console.error("Element with ID 'produkty' not found.");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const evidence = new Evidence_of_cameras();
});
