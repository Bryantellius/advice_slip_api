console.log("Hello World!");

const btn = document.getElementById("adviceBtn");

btn.addEventListener("click", fetchAdvice);

function fetchAdvice() {
  console.log("btn click event");

  // Grab elements
  const query = document.getElementById("search");
  const p = document.getElementById("advice");
  const searches = document.getElementById("previousSearches");

  p.innerHTML = "";

  // Call api
  fetch(`https://api.adviceslip.com/advice/search/${query.value}`, {
    mode: "cors",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      if (response.slips) {
        const ol = document.createElement("ol");

        response.slips.forEach(({ advice }) => {
          // Create a li for each advice object
          const li = document.createElement("li");
          li.textContent = advice;
          // Append new advice li to ol
          ol.appendChild(li);
          // Append new ol to p
          p.appendChild(ol);
        });
      } else {
        p.textContent = response.message.text;
      }

      let exists = false;

      for (let child of searches.children) {
        if (child.textContent.includes(query.value)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        const prevSearch = document.createElement("p");
        prevSearch.textContent = query.value;
        prevSearch.addEventListener("click", (event) => {
          query.value = event.target.textContent;
          fetchAdvice();
        });
        searches.appendChild(prevSearch);
      }
    });
}
