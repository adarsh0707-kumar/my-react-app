import { v4 as uuidv4 } from 'uuid';


export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 10) {
    return accountNumber
  }

  const firstTwo = accountNumber.substring(0, 2)
  const lastThree = accountNumber.substring(accountNumber.length - 3)

  const maskedDigits = "*".repeat(accountNumber.length - 5)
  
  return `${firstTwo}${maskedDigits}${lastThree}`
}

export const formatCurrency = (value) => {
  const user = JSON.parse(localStorage.getItem("user"))

  if (isNaN(value)) {
    return "Invalid Input"
  
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: user?.currency || "USD",
    minimumFractionDigits: 2,
  }).format(numberValue)
}

export const getDataSevenDaysAgo = () => {
  const today = new Date()

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  return sevenDaysAgo.toISOString().split("T")[0];
}

export async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,currencies")
    
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0];

        return {
          country: country.name?.common || "",
          flag: country.flags?.png || "",
          currency: currencyCode || "",
        }
      });

      const sortedCountries = countries.sort((a, b) => {
        return a.country.localeCompare(b.country);  // Added return here
      });

      return sortedCountries;
    }
    else {
      console.error(`Error : ${data.message}`);
      return [];
    }
  }
  catch (err) {
    console.error("Error fetching countries:", err);
    return [];
  }
}

export function generateAccountNumber() {
  let accountNumber = "";
  while (accountNumber.length < 13) {
    const uuid = uuidv4().replace(/-/g, "")
    accountNumber += uuid.replace(/\D/g,"")
  }
  return accountNumber.substr(0,13)
}
