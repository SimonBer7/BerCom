document.addEventListener("DOMContentLoaded", function () {
  $("#panel").show();
  const buttons = document.querySelectorAll(".filter_buttons .btn");
  const panels = document.querySelectorAll("#panel .products");

  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      panels.forEach((panel) => {
        panel.classList.add("d-none");
      });
      panels[index].classList.remove("d-none");
      $("#panel").show();
    });
  });
});
