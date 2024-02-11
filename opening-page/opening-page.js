let btns = document.querySelectorAll(".city-card");

for(let i=0; i<5; i++){
    btns[i].addEventListener("click", () => {
        let city = btns[i].getAttribute("id");
        window.location.assign(`${city}/${city}.html`);
    })
}

// btns.forEach((btn) => {
//     btn.addEventListner("click", () => {
//         let city = btn.getAttribute("id");
//         window.location.assign(`${city}/${city}.html`);
//     });
// });