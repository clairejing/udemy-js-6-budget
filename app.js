 var budgetController = (function () {
    var Expense = function (id, description, value) {
      this.id = id
      this.description = description
      this.value = value
    }

    var Income = function (id, description, value) {
      this.id = id
      this.description = description
      this.value = value
    }

    var calculateTotal = function(type) {
      var sum = 0
      data.allItems[type].forEach(function (current, index, array) {
        sum += current.value
      })
      data.totals[type] = sum
    }

    var data = {
      allItems: {
        exp: [],
        inc:[]
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
    }

    return {
      addItem: function (type, des, val) {
        var newItem, ID
        if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1
        } else {
          ID = 0
        }
        if (type === 'exp') {
          newItem = new Expense(ID, des, val)
        } else {
          newItem = new Income(ID, des, val)
        }
        data.allItems[type].push(newItem)

        return newItem
      },
      calculateBudget: function () {
        calculateTotal('exp')
        calculateTotal('inc')
        data.budget = data.totals.inc -data.totals.exp
        if (data.totals.inc > 0) {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
        } else {
          data.percentage = -1
        }
      },
      getBudget: function () {
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.totals.percentage
        }
      }
    }

 }) ()


 var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: 'budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }
    return {
      getinput: function () {
        return {
          type: document.querySelector(DOMStrings.inputType).value,
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
        }
      },

      addListItem: function (obj, type) {
        var html, newHtml, element
        if (type === 'inc') {
          element = DOMStrings.incomeContainer
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === 'exp') {
          element = DOMStrings.expensesContainer
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHtml = html.replace('%id%', obj.id)
        newHtml = html.replace('%description%', obj.description)
        newHtml = html.replace('%value%', obj.value)

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

      },

      clearFields: function () {
        var fields, fieldsArr
        fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)

        fieldsArr = Array.prototype.slice.call(fields)

        fieldsArr.forEach(function (current, index, array) {
          current.value = ""
        })
      },
      displayBudget: function (obj) {
        document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget
        document.querySelector(DOMStrings.incometLabel).textContent = obj.totalInc
        document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage
        if (obj.percentage > 0) {
          document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'

        } else {
          document.querySelector(DOMStrings.percentageLabel).textContent = '-'
        }
      },

      getDOMStrings: function () {
        return DOMStrings
      }
    }

 }) ()


 var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
      var DOMStrings = UICtrl.getDOMStrings()

      document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem)

      document.addEventListener('keypress', function () {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem()
        }
      })
    }

    var updateBudget = function () {
      budgetCtrl.calculateBudget()
      var budget = budgetCtrl.getBudget()
      UICtrl.displayBudget(budget)
    }

    var ctrlAddItem = function () {
      var input, newItem
      input = UICtrl.getinput()

      if (input.description !== "" && isNaN(input.value) && input.value > 0) {
        newItem = budgetController(input.type, input.description, input.value) 
        UICtrl.addListItem(newItem, input.type)
        updateBudget()
      }
    }

    return {
      init: function () {
        console.log('Application has started')
        setupEventListeners()
        displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: '-'
        })
      }
    }

 }) (budgetController, UIController)



 controller.init()