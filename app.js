console.log("Hello World!");

const btn = document.getElementById("adviceBtn");

btn.addEventListener("click", fetchAdvice);

function fetchAdvice() {
  console.log("btn click event");

  // Grab elements
  const query = document.getElementById("search");
  const p = document.getElementById("advice");
  const searches = document.getElementById("previousSearches");
  const saved = document.getElementById("savedAdvice");

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

        response.slips.forEach(({ advice, id }) => {
          // Create a li for each advice object
          const li = document.createElement("li");
          li.id = id;
          li.textContent = advice;
          for (let child of saved.children) {
            if (child.textContent.includes(advice)) {
              li.style.backgroundColor = "yellow";
              break;
            }
          }
          li.addEventListener("click", (event) => {
            event.target.style.backgroundColor = "yellow";

            let exists = false;

            for (let child of saved.children) {
              if (child.textContent.includes(event.target.textContent)) {
                exists = true;
                break;
              }
            }

            if (!exists) {
              const advice = document.createElement("p");
              advice.id = "advice" + id;
              advice.textContent = event.target.textContent;
              advice.addEventListener("dblclick", (event) => {
                document.getElementById(id).style.backgroundColor = "white";
                saved.removeChild(event.target);
              });
              saved.appendChild(advice);
            }
          });
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
        prevSearch.style.color = response.slips ? "black" : "red";
        prevSearch.addEventListener("click", (event) => {
          query.value = event.target.textContent;
          fetchAdvice();
        });
        searches.appendChild(prevSearch);
      }
    });
}
