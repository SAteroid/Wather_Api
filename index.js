const http = require("http");
const fs = require("fs");
const axios = require("axios");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);


  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=london&appid=567b282f7658ee308039390110aba6ba"
      )
      .then((response) => {
        const objdata = response.data;
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        res.end();
      })
      .catch((error) => {
        console.error("Error fetching data from OpenWeatherMap API:", error);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
