

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


