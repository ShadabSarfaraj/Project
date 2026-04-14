function calculateBMI() {
  const heightEle = document.getElementById("height");
  const weightEle = document.getElementById("weight");
  console.log(heightEle);
  let height = +heightEle.value;
  const weight = +weightEle.value;

  height = height / 100;

  const bmi = weight / (height * height);

  document.getElementById("result").innerHTML = bmi;
}
