 var budgetController = (function () {

 }) ()


 var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
      getinput: function () {
        return {
          type: document.querySelector(DOMStrings.inputType).value,
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: document.querySelector(DOMStrings.inputValue).value
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

    var ctrlAddItem = function () {
      var input = UICtrl.getinput()
      console.log(input)
    }

    return {
      init: function () {
        console.log('Application has started')
        setupEventListeners()
      }
    }

 }) (budgetController, UIController)



 controller.init()