const categories = [ 'Dresses', 'Pants', 'Shirts', 'Shoes', 'Shorts' ];

	
function refreshTicker() {
    
    let cartCheck = sessionStorage.getItem("cart");
    if(cartCheck !== null){
        cartCheck = JSON.parse(cartCheck);
        let cartIcon = document.getElementById("cartCount");
        let resCartIcon = document.getElementById("resCartCount");        
        cartIcon.innerHTML = cartCheck.length;
        resCartIcon.innerHTML = cartCheck.length;
        console.log("To test tickerUpdate");
    }
}

function addToCart(id){
    var cart = sessionStorage.getItem("cart");
    if(cart === null){
        cart = [];
        cart.push(id);
        let cartIcon = document.getElementById("cartCount");
        let resCartIcon = document.getElementById("resCartCount");
        cartIcon.innerHTML = cart.length;
        resCartIcon.innerHTML = cart.length;
        sessionStorage.setItem("cart",JSON.stringify(cart));
        
     }
        
    else {
        cart = JSON.parse(sessionStorage.getItem("cart"));
        cart.push(id);
        sessionStorage.setItem("cart",JSON.stringify(cart));
        cart = JSON.parse(sessionStorage.getItem("cart"));
        let cartIcon = document.getElementById("cartCount");
        let resCartIcon = document.getElementById("resCartCount");
        cartIcon.innerHTML = cart.length;
        resCartIcon.innerHTML = cart.length;
    }
}

async function populatePage(demographic){
    var itemsArray = await requestItems(demographic, categories);
    fillCategories(itemsArray, demographic);
    refreshTicker();
}

async function requestItems(demographic, categories){
    let result;
    
    try{
        result = await $.ajax({
            url : '../api/items',
            method : 'GET',
            data: {
              demographic: demographic,
              categories: categories
            }
        });
        return result;
    } catch (error){
        console.log(error);
    }
}

async function doAjax(args) {
    let result;

    try {
        result = await $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: args
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

function fillCategories(itemsArray, demographic){
    categories.forEach(category =>{
        var catItemArray = [];
        itemsArray.forEach(item =>{
            if(item['category'] == category){
                catItemArray.push(item);
            }
        });
        fillHTML(catItemArray, category, demographic);
    });
    
}

function fillHTML(catItemArray, category, demographic){
    
    var stringData = "";
    if(catItemArray.length > 0){
        catItemArray.forEach(item => {
            stringData += `<div class='dispItem'>`;
            stringData += `<img src='./resources/images/${demographic}/${category}/${item['image']}' alt='${item['image']}'>`;
            stringData += `<h3>${item['name']}</h3>`;
            stringData += `<p>$${item['price']}</p>`;
            stringData += `<button id='${item['_id']}' onclick='addToCart(id)' style = "cursor: pointer;" >Add To Cart</button>`;
            //stringData += `<button id='${item['_id']}'>Add To Cart</button>`;
            stringData += "</div>";
        });

        var catId = `#${category}`;
        $(catId).html(stringData);  

        // $('button').click(function(){
        //     var id = $(this).attr('id');
        
        //     var cart = sessionStorage.getItem("cart");
        //     console.log("called");
        
        //     if(cart === null){
        //         cart = [];
        //         cart.push(id);
        //         sessionStorage.setItem("cart",JSON.stringify(cart));
        //     } else {
        //         cart = JSON.parse(sessionStorage.getItem("cart"));
        //         cart.push(id);
        //         sessionStorage.setItem("cart",JSON.stringify(cart));
        //         cart = sessionStorage.getItem("cart");
        //     }
        //     console.log(cart);
        //     }
            
        //     );
    } else{
        console.log("No items for " + category);
    }
    
}
