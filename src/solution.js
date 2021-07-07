import { parseISO, getYear } from "date-fns";

const renderData = (data) => {
  // This could have been an arrow function without brackets.
  // But, honestly I did not like, how prettier formatted it.
  document.querySelector("#out").innerHTML = JSON.stringify(data, null, 2);
};

const prepareData = (data) => {
  const byYear2018 = ({ launch_date_utc }) => {
    // Initially, for UTC dates I wanted to use Date.parse() method.
    // But MDN says that it's not recommended using it,
    // because of the some parsing implementations in JS.
    // So I decided to use date-fns library, which is basically
    // lightweight and more functional alternative to moment.js.
    return getYear(parseISO(launch_date_utc)) === 2018;
  };

  const byNASA = ({ rocket }) => {
    // At first I thought that simple `array.includes` method would do the trick for finding in nested array,
    // but when I got stuck, after a research, I ended up using solution found here: https://stackoverflow.com/a/40025777/313750
    return rocket.second_stage.payloads.find(({ customers }) =>
      customers.some((customer) => customer.includes("NASA"))
    );
  };

  const byPayloadsCount = (a, b) => {
    const payloadsCountA = a.rocket.second_stage.payloads.length;
    const payloadsCountB = b.rocket.second_stage.payloads.length;

    const launchDateA = a.launch_date_unix;
    const launchDateB = b.launch_date_unix;

    // First sort by number of payloads, then by launch date in DESC.
    if (payloadsCountA < payloadsCountB || launchDateA < launchDateB) return 1;
    if (payloadsCountA > payloadsCountB || launchDateA > launchDateB) return -1;
    return 0;
  };

  // Honestly, I suck at naming things, so `toRender` was best, what I could come up with.
  const toRender = ({ flight_number, mission_name, rocket }) => ({
    flight_number,
    mission_name,
    payloads_count: rocket.second_stage.payloads.length,
  });

  // Yes, a lot of variables and functions were introduced above, I know.
  // But I think code is for humans and I really like, how the next few lines look like.
  return (
    data
      // Yes, I know, that using `.filter` method twice adds extra iteration, which can be less optimized.
      // So, here's an alternative way of doing it: `.filter((launch) => byYear2018(launch) && byNASA(launch))`
      .filter(byYear2018)
      .filter(byNASA)
      .sort(byPayloadsCount)
      .map(toRender)
  );
};

module.exports = {
  prepareData,
  renderData,
};
