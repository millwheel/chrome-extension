setInterval(() => {
  let imgs = document.querySelectorAll("img");
  imgs.forEach((img) => {
    img.src =
      "https://www.chosun.com/resizer/v2/ZYPY6QMIOX2MLIDAHFVSAK3V4M.jpg?auth=a480083a83d7e5b8fe76e49a1e8a281f507b72ff882ef45ac6cbd58c99166ec0&width=600&height=600&smart=true";
  });
}, 500);
