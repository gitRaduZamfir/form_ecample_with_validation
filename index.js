"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);
    formData.append("image", formImage.files[0]);

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      } else {
        alert("Eroare");
        form.classList.remove("_sending");
      }
    } else {
      alert("Completați câmpurile obligatorii!");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains("_email")) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        formAddError(input);
        error++;
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
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
  function emailTest(input) {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      input.value
    );
  }

  const formImage = document.getElementById("formImage");
  const formPreview = document.getElementById("formPreview");

  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)
    ) {
      alert("Se permit doar imagini!");
      formImage.value = "";
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("File-ul ales trebuie sa fie mai mic de 2 MB.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      formPreview.innerHTML = `<img src="${e.target.result}" alt = "foto">`;
    };
    reader.onerror = function (e) {
      alert("Eroare");
    };
    reader.readAsDataURL(file);
  }
});
