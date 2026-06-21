const clock = function () {
  const nw = new Date();
  const hour = nw.getHours();
  const minute = nw.getMinutes();
  const second = nw.getSeconds();
  //   console.log(`${hour}:${minute}:${second}`);
  document.querySelector("#date").textContent = `${hour}:${minute}:${second}`;
};

console.log(setInterval(clock, 1000));
