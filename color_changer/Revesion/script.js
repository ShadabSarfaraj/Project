let nodeList = document.querySelectorAll(".selector");
console.log(nodeList);
nodeList.forEach(function (element) {
  console.log(element);
  element.addEventListener("click", function (element) {
    document.body.style.backgroundColor = this.dataset.color;
  });
});
