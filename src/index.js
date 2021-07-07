import { prepareData, renderData } from "./solution";

(() => {
  // Yes, I could also have used axios and/or async/await syntax here, but why?
  // And you might even think, that this could have been done without IIFE also.
  fetch("https://api.spacexdata.com/v3/launches/past")
    .then((res) => res.json())
    .then(prepareData) // Same as `.then(data => prepareData(data))`
    .then(renderData)
    // Yeah, old good `alert`.
    .catch(() => alert("Sorry, can't display list of SpaceX launches."));
})();
