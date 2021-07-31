const Modal = {
  open(){
    // Abrir Modal
    // Adicionar a classe active ao modal
    document.querySelector(".modal-overlay")
      .classList.add("active")
  },
  close(){
    // fechar o modal
    // remover a classe active do modal
    document.querySelector(".modal-overlay")
      .classList.remove("active")
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev-finances:transactions")) ||
    []
  },
  set(transactions) {
    localStorage.setItem("dev-finances:transactions", JSON.stringify(transactions))
  },
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
      Transaction.all.push(transaction)

      App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0;
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
      //se ela for maior que zero
      if( transaction.amount > 0) {
        //somar a uma variavel e retornar a variavel
        income += transaction.amount;
      }
    }) 
    return income;
  },
  expenses() {
    let expenses = 0;
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
      //se ela for menor que zero
      if( transaction.amount < 0) {
        //somar a uma variavel e retornar a variavel
        expenses += transaction.amount;
      }
    }) 
    return expenses;
   
  },
  total() {
    return Transaction.incomes() + Transaction.expenses();
  }
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    console.log(transaction)
    const tr = document.createElement("tr")
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index 
    
    DOM.transactionsContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick ="Transaction.remove(${index})"src="/assets/minus.svg" alt="Remover Transação">
      </td>
    `
    return html

  },

  updateBalance() {
    document
      .getElementById("incomeDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById("expenseDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById("totalDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100 
    
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  return signal + value
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if(
      description.trim() === "" || 
      amount.trim() === "" ||
      date.trim() === "") {
        throw new Error("Por favor, preencha todos os campos")
      }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction) {
    Transaction.add(transaction)
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  formatDate() {

  },
  submit(event) {
    event.preventDefault()

    try {
          // verificar se todas as informações foram preenchidas
    Form.validateFields()
    // formatar os dados para salvar
    const transaction = Form.formatValues()
    // salvar
    Form.saveTransaction(transaction)
    // apagar os dados do formulario
    Form.clearFields()
    // modal feche
    Modal.close()
    // atualiazar a aplicação
    // App.reload()

    } catch (error) {
      alert(error.message)
    }

  }

}

const App = {
  init() {

    Transaction.all.forEach(DOM.addTransaction)
    
    DOM.updateBalance()

    Storage.set(Transaction.all)

  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()


/* =============== Darkmode =============== */
const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) =>
  window
    .getComputedStyle(element)
    .getPropertyValue(style)

const initialColors = {
  bg: getStyle(html, "--bg"),
  modal: getStyle(html, "--modal"),
  white: getStyle(html, "--white"),
  footer: getStyle(html, "--footer"),
  darkBlue: getStyle(html, "--dark-blue"),
  dataTable: getStyle(html, "--data-table"),
  dataTabletitles: getStyle(html, "--data-table-titles"),
}

const darkMode = {
  bg: "#191919",
  modal: "#232323",
  white: "#232323",
  footer: "#232323",
  darkBlue: "#F8F8F8",
  dataTable: "#F8F8F8",
  dataTabletitles: "#F8F8F8",
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase()

const changeColors = (colors) => {
  Object.keys(colors).map(key => 
    html.style.setProperty(transformKey(key) , colors[key])
  )
  }  
checkbox.addEventListener("change", ({target}) => {
  target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
  JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    createOrEditLocalStorage('modo','darkMode')
  } else {
    changeColors(initialColors)
    createOrEditLocalStorage('modo','initialColors')
  }
})

if(!isExistLocalStorage('modo'))
  createOrEditLocalStorage('modo', 'initialColors')


if (getValeuLocalStorage('modo') === "initialColors") {
  checkbox.removeAttribute('checked')
  changeColors(initialColors);
} else {
  checkbox.setAttribute('checked', "")
  changeColors(darkMode);
}