const convertButton = document.getElementById("convertButton")
const amount = document.getElementById("amount")
const description = document.getElementById("description")
const result = document.getElementById("result")
const currency = document.getElementById("currency")

amount.addEventListener("input", () => {
  const hasCharactersRegex = /[^\d.,]/g
  amount.value = amount.value.replace(hasCharactersRegex, "")
})

convertButton.addEventListener("click", async (event) => {
  event.preventDefault()

  try {
    let price
    let symbol

    switch (currency.value) {
      case "USD":
        price = await fetchBCBRate(1)
        symbol = "US$"
        break;
      case "EUR":
        price = await fetchBCBRate(21619)
        symbol = "€"
        break;
      case "NOK":
        price = await fetchBCBRate(21635)
        symbol = "kr"
        break;
    }

    convertCurrency(amount.value, price, symbol);

  } catch (error) {
    console.log(error)
    alert("Error while checking the exchange rate on the Central Bank of Brazil website. Please try again later.")
  }

});

async function fetchBCBRate(serieId) {
  const today = new Date()
  const pastDate = new Date()
  pastDate.setDate(today.getDate() - 10)

  const format = (date) =>
    date.toLocaleDateString("pt-BR", { timeZone: "UTC" })

  const initialDate = format(pastDate)
  const finalDate = format(today)

  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serieId}/dados?formato=json&dataInicial=${initialDate}&dataFinal=${finalDate}`;

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Error accessing the BCB API");
  }

  const data = await response.json()

  console.log("JSON recebido do BCB:", data)

  if (!data.length) {
    throw new Error("No data returned by BCB")
  }

  const last = data[data.length - 1]

  return Number(last.valor.replace(",", "."))
}

function convertCurrency(amount, price, symbol) {
  try {
    // throw new Error("Forced Error");
    description.textContent = `${symbol} 1 = ${formatCurrency(price)}`

    let numericAmount = parseFloat(amount.replace(",", "."))
    let total = numericAmount * price

    if (Number.isNaN(total)) {
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