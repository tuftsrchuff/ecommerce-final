var cartDBReadyItems = [];
var userInfo;
var total;
async function getItems(cart){
    try{
        console.log("Getting items from DB");
        result = await $.ajax({
            url : '../api/checkout',
            method : 'GET',
            data: {
                items: cart
            }
        });

        cartDBReadyItems = result;

        populateCheckoutItems(result);
        updateTotal();

    } catch (error){
        console.log(error);
    }
}

function updateTotal(){
    var item ;
    var subtotal = 0;
    var tax = 0;
    var fintotal = 0;
    for(i = 0; i < cartDBReadyItems.length; i++){
        item = cartDBReadyItems[i];
        subtotal += item["price"];
    }

    tax = subtotal * 0.0625;
    fintotal = subtotal + tax;
    tax = tax.toFixed(2);
    fintotal = fintotal.toFixed(2);
    total = fintotal;

    var stringData = "";
    stringData += "<h3>Total</h3>";
    stringData += `<p>Sub Total: $${subtotal}</p>`;
    stringData += `<p>Tax (6.25%): $${tax}</p>`;
    stringData += `<p>Final Total: $${fintotal}</p>`;


    $("#cartTotal").html(stringData);
}

function populateCheckoutItems(itemsArray){
    let stringData = "";
    itemsArray.forEach(item => {
        stringData += `<div class='dispItem ${item['_id']}'>`;
        stringData += `<img src='./resources/images/${item['demographic']}/${item['category']}/${item['image']}' alt='${item['image']}'>`;
        stringData += `<h3>${item['name']}</h3>`;
        stringData += `<p>$${item['price']}</p>`;
        stringData += `<button id='${item['_id']}' class='deleteBtn'>Remove Item</button>`;
        stringData += "</div>";
    });

    $("#cart").html(stringData);

    $('.deleteBtn').click(function(){
    var id = $(this).attr('id');
    
    removeItemFromCart(id);
    updateTotal();

    
    });
}

function removeItemFromCart(id){
    var cart = sessionStorage.getItem("cart");
    newCart = JSON.parse(cart).filter(elem => elem != id);

    sessionStorage.setItem("cart",JSON.stringify(newCart));

    cartDBReadyItems = cartDBReadyItems.filter(elem => elem["_id"] != id);

    $(`.${id}`).hide();

}

async function getUserInfo(user){
    let result;
    try{
        console.log("Trying AJAX");
        result = await $.ajax({
            url : '../api/checkout/userInfo',
            method : 'GET',
            data: {
                username: user
            }
        });

        userInfo = result;
        sessionStorage.setItem("address", userInfo['paddr']);

        populateUserData(userInfo);

        $("#checkoutBtn").click(function(){
            logOrder();
        })

    } catch (error){
        console.log(error);
    }
}

async function populateAllInfo(cart, user){
    await getItems(cart);
    await getUserInfo(user);
}

function populateUserData(userInfo){
    stringData = "<h3>User Checkout Information</h3>";
    stringData += `<p>Name: ${userInfo['first']} ${userInfo['last']}</p>`;
    stringData += `<p>Delivery Address: ${userInfo['paddr']}</p>`;
    stringData += `<p>Credit Card: ${userInfo['CC']}</p>`;
    stringData += `<p>Email: ${userInfo['email']}</p>`
    stringData += `<button id='checkoutBtn'>Checkout</button>`
    
    $("#userInfo").html(stringData);
}

async function logOrder(){
    console.log(userInfo);
    cart = JSON.parse(sessionStorage.getItem("cart"));

    var date = getDate();

    $.ajax({
        method: "POST",
        url: "/api/checkout",
        data: { cart: cartDBReadyItems, user: userInfo, orderDate: date, trees: cart.length, total: total }
         })
        .done(function( msg ) {
        if(msg == 1){
            alert("Order submitted successfull!");
            location.href = './confirmation';
        }
        });
}

function getDate(){
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = mm + '/' + dd + '/' + yyyy;
    return formattedToday;
}

