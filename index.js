"use strict";

let x, y, r;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".fields-form");
  form.addEventListener("submit", formSend);

  function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);

    if (error === 0) {
      if (validateX() && validateY() && validateR()) {
        const coords =
          "&x=" +
          encodeURIComponent(x) +
          "&y=" +
          encodeURIComponent(y) +
          "&r=" +
          encodeURIComponent(r); + 
          "&timezone=" +
          encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

        fetch("./script.php?" + coords, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
          .then((response) => response.text())
          .then(function (serverAnswer) {
            // Вставляем ответ от сервера (таблицу) с id "outputContainer"
            document.getElementById("outputContainer").innerHTML = serverAnswer;
          })
          .catch((err) =>
            createNotification(
              "Ошибка HTTP " + err.status + ". Повторите попытку позже. " + err
            )
          );
      }
    } else {
      alert("Заполните обязательные поля");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
    return error;
  }

  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }

  function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");

    if (outputContainer.contains(document.querySelector(".notification"))) {
      let stub = document.querySelector(".notification");
      stub.textContent = message;
      stub.classList.replace("outputStub", "errorStub");
    } else {
      let notificationTableRow = document.createElement("h4");
      notificationTableRow.innerHTML =
        "<span class='notification errorStub'></span>";
      outputContainer.prepend(notificationTableRow);
      let span = document.querySelector(".notification");
      span.textContent = message;
    }
  }


  function validateY() {
    y = document.querySelector(".fields-input").value.replace(",", ".");
    if (y.trim() === "") {
      createNotification("Y не введён");
      return false;
    } else if (!isNumeric(y)) {
      createNotification("Y не число");
      return false;
    } else if (!(y >= -5 && y <= 3)) {
      createNotification("Y не входит в область допустимых значений");
      return false;
    }
    return true;
  }

  function validateX() {
    const select = document.querySelector("#select");
    if (select.selectedIndex === -1) {
      createNotification("Значение X не выбрано");
      return false;
    }
    x = select.options[select.selectedIndex].value;
    return true;
  }

  function validateR() {
    const radios = document.querySelectorAll(
      ".fields-radios input[type='radio']:checked"
    );
    if (radios.length === 0) {
      createNotification("Значение R не выбрано");
      return false;
    }
    r = radios[0].value;
    return true;
  }

  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
});

document.getElementById("clear-button").addEventListener("click", function () {
  document.getElementById("outputContainer").innerHTML = "";
});



