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

document.addEventListener("DOMContentLoaded", function () {
  var acc = document.getElementsByClassName("accordion");

  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

  class Evidence {
    constructor() {
      this.products = [];
      this.loadData();
    }

    addProduct(product) {
      this.products.push(product);
    }

    loadData() {
      if (localStorage.getItem("produkty") == null) {
        this.getFromWeb();
        console.log("Data were loaded from the web");
      } else {
        alert("Error with loading cards.");
      }
    }

    getFromWeb() {
      let self = this;
      $.ajax({
        url: "https://raw.githubusercontent.com/SimonBer7/BerCom/main/data/produkty.json",
        dataType: "json",
        success: function (data) {
          data["telefony"].forEach((product) => {
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
          self.printProducts();
        },
        error: function () {
          // error callback
          alert("Error with connection to website");
        },
      });
    }

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

  var evidence = new Evidence();

  $("#buttonBticino").click(function () {
    $("#panel").slideToggle();
  });
});
