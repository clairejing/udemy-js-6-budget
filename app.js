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

    var data = {
      allItems: {
        exp: [],
        inc:[]
      },
      totals: {
        exp: 0,
        inc: 0
      }
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
        expensesContainer: '.expenses__list'
    }
    return {
      getinput: function () {
        return {
          type: document.querySelector(DOMStrings.inputType).value,
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: document.querySelector(DOMStrings.inputValue).value
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

    var ctrlAddItem = function () {
      var input, newItem
      input = UICtrl.getinput()
      newItem = budgetController(input.type, input.description, input.value) 
      UICtrl.addListItem(newItem, input.type)
    }

    return {
      init: function () {
        console.log('Application has started')
        setupEventListeners()
      }
    }

 }) (budgetController, UIController)



 controller.init()