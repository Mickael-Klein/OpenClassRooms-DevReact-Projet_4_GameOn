function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeModalBtn = document.querySelector(".close");
const firstName = document.querySelector("#first");
const lastName = document.querySelector("#last");
const email = document.querySelector("#email");
const birthdate = document.querySelector("#birthdate");
const quantity = document.querySelector("#quantity");
const formDataNodeList = document.querySelectorAll(".formData");
const radioLocationDiv = formDataNodeList[5];
const radioLocationNodeList =
  radioLocationDiv.querySelectorAll(".checkbox-input");
const firstRadio = radioLocationNodeList[1];
const cguCheckbox = document.querySelector("#checkbox1");
const newsletterCheckbox = document.querySelector("#checkbox2");
const submitBtn = document.querySelector(".btn-submit");
const modalBody = document.querySelector(".modal-body");
const closeCross = document.querySelector(".content .close");

// Tableau des éléments sur lesquels itérer pour form verif
const domElemArr = [firstName, lastName, email, birthdate, quantity];

// Liste des regex requises
const regexName = new RegExp(/^[a-zA-Z]{2,}$/);
const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
const regexDate = new RegExp(
  /^(19\d{2}|2[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
);
const regexNumber = new RegExp(/^\d{1,3}$/);

// Tableau des éléments à comparer et msg d'erreur associés
const errorMessages = [
  { msg: "Veuillez saisir un prénom au format valide", regex: regexName },
  { msg: "Veuillez saisir un nom au format valide", regex: regexName },
  { msg: "Veuillez saisir un email au format valide", regex: regexEmail },
  { msg: "Veuillez saisir une date au format valide", regex: regexDate },
  { msg: "Veuillez saisir un chiffre (si 0, saisissez 0)", regex: regexNumber },
  { msg: "Veuillez cochez l'une des options" },
  { msg: "L'acceptation de nos CGU est obligatoire pour s'inscrire" },
];

// fonction pour affichage erreur (max 1 msg par element)
const putErrorMsg = (index, parentElement) => {
  let textAlreadyExist = parentElement.querySelector(".errorMsg");
  if (textAlreadyExist) {
    return;
  }
  const text = document.createElement("p");
  text.classList.add("errorMsg");
  text.textContent = errorMessages[index].msg;
  parentElement.appendChild(text);
  parentElement.querySelector("input").style.border = "solid red 2px";
};

//fonction pour supprimer affichage erreur si réctifiée
const removeErrorMsg = (parentElement) => {
  let textAlreadyExist = parentElement.querySelector(".errorMsg");
  if (textAlreadyExist) {
    textAlreadyExist.remove();
  }
  parentElement.querySelector("input").style.border = "none";
};

// fonction de verif radio check
const radioCheck = () => {
  let oneIsChecked = false;
  radioLocationNodeList.forEach((radio) => {
    if (radio.checked) {
      oneIsChecked = true;
    }
  });
  return oneIsChecked ? true : false;
};

const wichCityOnRadio = () => {
  let selectedCity = "";
  radioLocationNodeList.forEach((radio) => {
    if (radio.checked) {
      selectedCity = radio.value;
    }
  });
  return selectedCity;
};

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// Close modal form
const closeModal = () => {
  modalbg.style.display = "none";
};

// Event Listener close modal event
closeModalBtn.addEventListener("click", closeModal);
closeCross.addEventListener("click", closeModal);

// Form check function
function validate() {
  const datas = {}; // initialisation de l'objet à envoyer au backend

  let containError = false; //variable de check d'erreur final pour le return
  domElemArr.forEach((elem, index) => {
    //pour chaque élément, on check via regex et si erreur, on affiche le msg d'erreur correspondant et passe variable check à true(err)
    if (!elem.value.match(errorMessages[index].regex)) {
      putErrorMsg(index, elem.parentElement);
      containError = true;
    } else {
      removeErrorMsg(elem.parentElement);
    }
  });
  if (!radioCheck()) {
    //check si aucun des btn radio est coché, si oui affiche message erreur
    putErrorMsg(5, firstRadio.parentElement);
    containError = true;
  } else {
    removeErrorMsg(firstRadio.parentElement);
  }
  if (!cguCheckbox.checked) {
    // check si cgu sont acceptées
    putErrorMsg(6, cguCheckbox.parentElement);
    containError = true;
  } else {
    removeErrorMsg(cguCheckbox.parentElement);
  }
  if (containError) {
    return false;
  } else {
    datas.firstName = firstName.value; //constitution fichier a envoyer au backend
    datas.lastName = lastName.value;
    datas.email = email.value;
    datas.birthdate = birthdate.value;
    datas.quantity = parseInt(quantity.value);
    datas.city = wichCityOnRadio();
    datas.cguCheckbox = cguCheckbox.checked;
    datas.subscribeNewsletter = newsletterCheckbox.checked;

    return datas; // retourne le fichier complété pour transmission
  }
}

// fonction qui affiche le message de validation d'inscription si form validate ok (pourrait aussi envoyer form au backend)
const sendDatas = () => {
  const validateResult = validate();
  if (validateResult !== false) {
    const jsonValidateResult = JSON.stringify({ validateResult });
    console.log(jsonValidateResult);
    // //Si envoie form au backend, fonction qui envoie les datas
    // sendToBackend(jsonValidateResult);
    const modalBodyWidth = modalBody.offsetWidth;
    const modalBodyHeight = modalBody.offsetHeight;
    modalBody.style.width = `${modalBodyWidth}px`;
    modalBody.style.height = `${modalBodyHeight}px`;
    modalBody.innerHTML = "";
    modalBody.innerHTML =
      '<div class="modalBody--after__textContent"><p>Merci pour votre inscription</p></div><button class="btn-submit modalBody--after__btn-submit" id="btn-closeModal">Fermer</button>';
    modalBody.classList.add("modalBody--after");
    const closeModalBtn = document.querySelector("#btn-closeModal");
    closeModalBtn.addEventListener("click", closeModal);
  } else {
    return false;
  }
};

// Fonction pour envoi futur au backend
const sendToBackend = (jsonObject) => {
  fetch("http://something.com/api/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((response) => {
      // traitement de la réponse
    })
    .catch((error) => {
      // traitement de l'erreur
    });
};

// ajout du prevent default et validation du form
document
  .querySelector("form[name='reserve']")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    sendDatas();
  });
