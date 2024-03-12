let country_code = {
  BRL: 'Real brasileiro',
  COP: 'Peso colombiano',
  USD: 'Dólar americano',
};

const apiKey = '32bddcf4bca43690910da085';

//Selecionar a lista
const dropList = document.querySelectorAll('.drop-list select'),
  fromCurrency = document.querySelector('.from select'),
  toCurrency = document.querySelector('.to select'),
  getButton = document.querySelector('form button');

// Acionar todas as opções de países
for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == 'Real brasileiro' ? 'selected' : '';
    } else if (i == 1) {
      selected = currency_code == 'Peso colombiano' ? 'selected' : '';
    }
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML('beforeend', optionTag);
  }
}

window.addEventListener('load', () => {
  getExchangeRate();
});

getButton.addEventListener('click', (e) => {
  e.preventDefault();
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector('form input'),
    exchangeRateTxt = document.querySelector('.exchange-rate');
  let amountVal = amount.value;
  if (amountVal == '' || amountVal == '0') {
    amount.value = '1';
    amountVal = 1;
  }
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

  exchangeRateTxt.innerText = 'Obtendo taxa de câmbio....';
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    });
}
