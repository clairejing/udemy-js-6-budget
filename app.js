 var budgetController = (function () {
    var Expense = function (id, description, value) {
      this.id = id
      this.description = description
      this.value = value
      this.percentage = -1
    }
    Expense.prototype.calPercentage = function (totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100)
      } else {
        this.percentage = -1
      }
    }

    var Income = function (id, description, value) {
      this.id = id
      this.description = description
      this.value = value
    }
    Expense.prototype.getPercentage = function () {
      return this.percentage
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
      deleteItem: function (type, id) {
        var ids, index

        ids = data.allItems[type].map(function(current) {
          return current.id
        })
        index = ids.indexOf(id)
        if (index !== -1) {
          data.allItems[type].splice(index, 1)
        }
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
      calculatePercentages: function () {
        data.allItems.exp.forEach(function(cur) {
          cur.calPercentage(cur.totals.inc)
        })
      },
      getPercentages: function () {
        var alPerc =data.allItems.exp.map(function(cur) {
          return cur.getPercentage()
        })
        return alPerc
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentagesLabel: 'item__percentage'
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
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === 'exp') {
          element = DOMStrings.expensesContainer
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHtml = html.replace('%id%', obj.id)
        newHtml = html.replace('%description%', obj.description)
        newHtml = html.replace('%value%', obj.value)

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

      },

      deleteListItem: function (selectorID) {
        var element = document.getElementById(selectorID)
        element.parentNode.removeChild(element)
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
      displayPercentages: function (percentages) {
        var fields = document.querySelectorAll(DOMStrings.expensePercentagesLabel)
        var nodeListForEach = function(list, callback) {
          for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
          }
        }

        nodeListForEach(fields, function(current, index){
          if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%'
          } else {
            current.textContent = '---'
          }
        })
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
      document.querySelector('.container').addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function () {
      budgetCtrl.calculateBudget()
      var budget = budgetCtrl.getBudget()
      UICtrl.displayBudget(budget)
    }

    var updatePercentages = function() {
      budgetCtrl.calculatePercentages()
      var percentages = budgetCtrl.getPercentages()
      UICtrl.displayPercentages()
      
    }

    var ctrlAddItem = function () {
      var input, newItem
      input = UICtrl.getinput()

      if (input.description !== "" && isNaN(input.value) && input.value > 0) {
        newItem = budgetController(input.type, input.description, input.value) 
        UICtrl.addListItem(newItem, input.type)
        updateBudget()
        updatePercentages()
      }
    }

    var ctrlDeleteItem = function (event) {
      var splitID, type, ID
      var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
      if (itemID) {
        splitID = itemID.split('-')
        type = splitID[0]
        ID = parseInt(splitID[1])
        budgetCtrl.deleteItem(type, ID)
        UICtrl.deleteListItem(itemID)
        updateBudget()
        updatePercentages()
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