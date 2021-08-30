const express = require("express");
const https = require("https");
const { parse } = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const date = new Date();
const currentDate = date.toLocaleDateString("en-GB");
const dayArray = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dayNight = date.getHours();

app.get("/", (req, res) => {
  res.render("weatherForm", {
    date: currentDate,
    day: dayArray[date.getDay()],
    dayOrNight: dayNight,
  });
});

console.log(dayNight)

app.post("/", (req, res) => {
  const city = req.body.city;
  const cnt = "6";
  const apiKey = "92c3cde648bccd46adafd159f4862f6f";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${cnt}&units=metric&appid=${apiKey}#`;

  https.get(url, (response) => {
    response.on("data", (data) => {
      const parsedData = JSON.parse(data);
      const today = {
        place: `${parsedData.city.name}, ${parsedData.city.country}`,
        description: parsedData.list[0].weather[0].description,
        temperature: Math.round(parsedData.list[0].main.temp),
        tempMin: Math.round(parsedData.list[0].main.temp_min),
        tempMax: Math.round(parsedData.list[0].main.temp_max),
        feelsLike: Math.round(parsedData.list[0].main.feels_like),
        humidity: parsedData.list[0].main.humidity,
        wind: Math.round(parsedData.list[0].wind.speed)
      };

      function HourlyForecast(icon, time, temp) {
        (this.icon = parsedData.list[icon].weather[0].icon),
          (this.time = parsedData.list[time].dt_txt.slice(-8, -3)),
          (this.temp = Math.round(parsedData.list[temp].main.temp));
      }

      const firstForecast = new HourlyForecast(1, 1, 1);
      const secondForecast = new HourlyForecast(2, 2, 2);
      const thirdForecast = new HourlyForecast(3, 3, 3);
      const fourthForecast = new HourlyForecast(4, 4, 4);
      const fifthForecast = new HourlyForecast(5, 5, 5); 

      res.render("postWeather", {
        // img: `http://openweathermap.org/img/wn/${img}@2x.png`,
        date: currentDate,
        day: dayArray[date.getDay()],
        dayOrNight: dayNight,
        today: today,
        first: firstForecast,
        second: secondForecast,
        third: thirdForecast,
        fourth: fourthForecast,
        fifth: fifthForecast
      });
    });
  });
});

app.listen((process.env.PORT || 5000), () => {
  console.log("route is connected");
});
