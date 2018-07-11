$(document).ready(function() {
  loadItems();
  var totalMoney = 0;
  var change;


  $('#addDollar').click(function(event) {
    change = $('#changeBox').val();
    if (change == '') {
      totalMoney += 1.00;
      $('#amountEntered').val(totalMoney);
    } else {
      $('#messagesBox').val('Take your change, ya filthy animal.');
    }
  });

  $('#addQuarter').click(function(event) {
    change = $('#changeBox').val();
    if (change == '') {
      totalMoney += .25;
      $('#amountEntered').val(totalMoney);
    } else {
      $('#messagesBox').val('Take your change, ya filthy animal.');
    }
  });

  $('#addDime').click(function(event) {
    change = $('#changeBox').val();
    if (change == '') {
      totalMoney += .10;
      $('#amountEntered').val(parseFloat(totalMoney).toFixed(2));
    } else {
      $('#messagesBox').val('Take your change, ya filthy animal.');
    }
  });

  $('#addNickel').click(function(event) {
    change = $('#changeBox').val();
    if (change == '') {
      totalMoney += .05;
      $('#amountEntered').val(parseFloat(totalMoney).toFixed(2));
    } else {
      $('#messagesBox').val('Take your change, ya filthy animal.');
    }
  });

  $('#changeReturnButton').click(function(event) {
    $('#changeBox').val('');
    totalMoney = 0;
    $('#amountEntered').val(0);
    $('#messagesBox').val('');
    $('#itemSelected').val('');
    loadItems();
  });

  $('#makePurchaseButton').click(function(event) {
    makePurchase();
  });
});

function loadItems() {
  clearItems();
  var vendingOptionsDiv = $('#vendingOptionsDiv');

  $.ajax({
    type: 'GET',
    url: 'http://llama-vending.herokuapp.com/items',
    success: function(itemArray) {
      console.log(itemArray);
      $.each(itemArray, function(index, item) {
        var id = item.id;
        var name = item.name;
        var price = parseFloat(item.price).toFixed(2);
        var quantity = item.quantity;
        var button = '<button type="button" class="btn btn-default itemButton" onclick="selectItem(' + id + ')">';
        button += '<table class="itemTable">';
        button += '<tr><td class="tableId">' + id + '</tr></td>';
        button += '<tr><td class="tableName">' + name + '</tr></td>';
        button += '<tr><td class="tablePrice">' + '$' + price + '</tr></td>';
        button += '<tr><td class="tableQuantity">' + 'Quantity Left: ' + quantity + '</tr></td>';
        button += '</table></button>';

        vendingOptionsDiv.append(button);
      });
    },
    error: function() {
      alert('Could not generate buttons');
    }
  });
}

function selectItem(id) {
  $('#messagesBox').val('');
  $('#itemSelected').val(id);
}

function makePurchase() {
  clearItems();
  $('#changeBox').val('');
  var itemArray = loadItems();
  if ($('#itemSelected').val() == '') {
    $('#messagesBox').val('Please select an item.');
  } else {
    var itemId = $('#itemSelected').val();
    var moneyEntered = $('#amountEntered').val();
    if (moneyEntered == '') {
      moneyEntered = 0;
    }

    $.ajax({
      type: 'GET',
      url: 'http://llama-vending.herokuapp.com/money/' + moneyEntered + '/item/' + itemId,
      success: function(data, status) {
        console.log(data);
        changeReturn(data);
        var message = 'Thank You!!!';
        $('#messagesBox').val(message);
        totalMoney = 0;
      },
      error: function(data) {
        console.log(data);
        var errorMsg = data.responseJSON.message;
        $('#messagesBox').val(errorMsg);
      }
    });
  }
}

function changeReturn(data) {
  var quarters = data.quarters;
  var dimes = data.dimes;
  var nickels = data.nickels;
  var pennies = data.pennies;
  var change = ('');

  if (quarters > 0) {
    if (quarters == 1) {
      change += 'Quarter: 1 ';
    } else {
      change += 'Quarters: ' + quarters + ' ';
    }
  }

  if (dimes > 0) {
    if (dimes == 1) {
      change += 'Dime: 1 ';
    } else {
      change += 'Dimes: ' + dimes + ' ';
    }
  }

  if (nickels > 0) {
    if (nickels == 1) {
      change += 'Nickel: 1 ';
    } else {
      change += 'Nickels: ' + nickels + ' ';
    }
  }

  if (pennies > 0) {
    if (pennies == 1) {
      change += 'Penny: 1 ';
    } else {
      change += 'Pennies: ' + pennies + ' ';
    }
  }

  if(change == '') {
    change = 'Please press "Change Return" to continue.'
  }

  $('#changeBox').val(change);
  $('#amountEntered').val(0);
}

function clearItems() {
  $('#vendingOptionsDiv').empty();
}
