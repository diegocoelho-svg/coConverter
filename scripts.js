const USD = 5.7140
const EUR = 6.4840
const NOK = 0.5564

const convertButton = document.getElementById("convertButton")
const amount = document.getElementById("amount")
const description = document.getElementById("description")
const result = document.getElementById("result")
const currency = document.getElementById("currency")

amount.addEventListener("input", () => {
  const hasCharactersRegex = /\D+/g
  amount.value = amount.value.replace(hasCharactersRegex,"")
})

convertButton.addEventListener("click", (event) => {
  event.preventDefault()

  switch (currency.value) {
    case "USD":
      convertCurrency(amount.value, USD, "US$")
      break;
    case "EUR":
      convertCurrency(amount.value, EUR, "€")
      break;   
    case "NOK":
      convertCurrency(amount.value, NOK, "kr")
      break;  
  }
});

function convertCurrency(amount, price, symbol) {
  try {
    // throw new Error("Forced Error");
    
    description.textContent = `${symbol} 1 = ${formatCurrency(price)}`

    let total = amount * price

    if (isNaN(total)) {
      return alert("Please enter the value correctly to convert.")
    }

    total = formatCurrency(total)
    result.textContent = `${total} Reais`
    
  } catch (error) {
    console.log(error)
    alert("Could not convert. Please try again later.")
  }
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}