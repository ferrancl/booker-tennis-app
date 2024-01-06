import React, { useState } from "react";
import COURTS from "./constants/courts";
import "./App.css";

function App() {
  const createDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthValue = date.getMonth();
      const day = date.getDate();
      const value = `${day}/${monthValue}/${year}`;
      const label = `${day}/${month}/${year}`;
      dates.push({ label, value });
    }
    return dates;
  };

  const dates = createDates();

  const [formData, setFormData] = useState({
    user: "14898",
    password: "",
    secondPlayer: "",
    court: "01",
    date: dates[0].value,
    time: "08:00",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const createHours = () => {
    const hours = [];
    for (let i = 8; i < 23; i++) {
      for (let j = 0; j < 4; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 15).toString().padStart(2, "0");
        const label = `${hour}:${minute}`;
        hours.push({ label, value: label });
      }
    }
    return hours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [day, month, year] = formData.date.split("/");
    const monthDate = parseInt(month) + 1;
    const monthDateValue =
      monthDate.toString().length === 1 ? `0${monthDate}` : monthDate;
    const dayValue = day.toString().length === 1 ? `0${day}` : day;
    const [hours, minutes] = formData.time.split(":");
    const bookingDate = new Date(year, month, day, hours, minutes);
    console.log("bookingDate", bookingDate);
    const { date, time, ...submitData } = formData;
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://booker-tennis-node-bfd2a5a31c95.herokuapp.com/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...submitData,
            bookingDate,
            time: hours + minutes,
            date: year + monthDateValue + dayValue,
          }),
        }
      );
      const { text } = await response.json();
      alert(text);
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  if (isLoading) return <div className="loader" />;

  return (
    <div className="App">
      <div className="title">
        <h1>Reserva tenis</h1>
      </div>
      <div className="content">
        <div className="row">
          <div className="input-wrapper">
            <span className="span-input">Numero de socio: </span>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <span className="span-input">Password: </span>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-wrapper">
            <span className="span-input">Jugador 2: </span>
            <input
              name="secondPlayer"
              id="secondPlayer"
              maxLength="5"
              value={formData.secondPlayer}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <label className="span-input" htmlFor="court">
              Pista:
            </label>
            <select name="court" id="courts" onChange={handleChange}>
              {COURTS.map(({ name, value }) => (
                <option name={"court"} id="court" value={value} key={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="input-wrapper">
            <label className="span-input" htmlFor="court">
              Fecha:
            </label>
            <select name="date" id="dates" onChange={handleChange}>
              {dates.map(({ label, value }) => (
                <option name="date" id="date" value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="span-input" htmlFor="court">
              Hora:
            </label>
            <select name="time" id="hours" onChange={handleChange}>
              {createHours().map(({ label, value }) => (
                <option name="time" id="time" value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          id="book-button"
          className="book-button"
          onClick={handleSubmit}
        >
          Reservar
        </button>
      </div>
    </div>
  );
}

export default App;
