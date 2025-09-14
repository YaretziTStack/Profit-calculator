

// Arrays to store items and their prices
let items = JSON.parse(localStorage.getItem("items")) || [];
let prices = JSON.parse(localStorage.getItem("prices")) ||[];
let totalCostStored = localStorage.getItem("totalCost") || 0
let profitStored = localStorage.getItem("profit") || 0


// Function to add an item only
function addItem() {
  const itemInput = document.getElementById("itemInput");
  const item = itemInput.value.trim();

  if (item === "") {
    alert("Please enter an item!");
    return;
  }

  items.push(item);

  saveData()

  // Update displayed lists
  updateLists();

  // Clear input
  itemInput.value = "";
}

// Function to add a price only
function addPrice() {
  const priceInput = document.getElementById("priceInput");
  const price = priceInput.value.trim();

  if (price === "") {
    alert("Please enter a price!");
    return;
  }

  prices.push(parseFloat(price).toFixed(2));

  saveData()

  // Update displayed lists
  updateLists();

  // Clear input
  priceInput.value = "";
}

// Function to update both lists (but NOT show total yet)
function updateLists() {
  const mainList = document.getElementById("mainList");       // Items list
  const connectedList = document.getElementById("connectedList"); // Prices list
  const allItemsSpan = document.getElementById("Allitems");   // Display all items

  const totalCostSpan = document.getElementById("totalcost")
  const totalprofitSpan = document.getElementById("totalprofit")

  // Clear old content
  mainList.innerHTML = "";
  connectedList.innerHTML = "";

  // Add items + prices aligned by index
  const maxLength = Math.max(items.length, prices.length);

  for (let i = 0; i < maxLength; i++) {
    const itemLi = document.createElement("li");
    itemLi.textContent = items[i] ? `${i + 1}. ${items[i]}` : `${i + 1}. (no item)`;
    mainList.appendChild(itemLi);

    const priceLi = document.createElement("li");
    priceLi.textContent = prices[i] ? `$${prices[i]}` : "(no price)";
    connectedList.appendChild(priceLi);

    //Add remove button for each item
    const removeBTN = document.createElement("button")
    removeBTN.textContent = "Remove"
    removeBTN.style.marginLeft = "50%"
    removeBTN.addEventListener("click", ()=> removeItem(i))
    itemLi.appendChild(removeBTN)
  }

  // Show all items in one line
  allItemsSpan.textContent = items.join(", ");
  totalCostSpan.textContent = `$${parseFloat(totalCostStored).toFixed(2)}`
  totalprofitSpan.textContent = `$${parseFloat(profitStored).toFixed(2)}`
}

// Function to calculate total cost (only when button is clicked)
function calculateTotal() {
  const totalCostSpan = document.getElementById("totalcost");

  const total = prices.reduce((sum, val) => sum + parseFloat(val), 0);
  totalCostStored = total

  totalCostSpan.textContent = `$${total.toFixed(2)}`;
  localStorage.setItem("totalcost", total)
}

// Attach calculate function to button
document.querySelector(".btn").addEventListener("click", calculateTotal);

// Attach addItem and addPrice to respective buttons
document.getElementById("addItembtn").addEventListener("click", addItem);
document.getElementById("itemPricebtn").addEventListener("click", addPrice);


// Profit calculator

const servingEl = document.getElementById("serving-sizes")
const profitPercentage = document.getElementById("percentage-id")

function getcostTotal(){
  return prices.reduce((sum, val) => sum + parseFloat(val), 0)
}

function priceTotal(){
  const servingInput = parseFloat(servingEl.value) || 0 
  const percentProfit = parseFloat(profitPercentage.value) || 0 
  const totalprofitSpan = document.getElementById("totalprofit")

  const final =  getcostTotal()

  if (servingInput<= 0){
    alert("Please enter a valid serving size!")
    return
  }

  const totalCost = parseFloat(totalCostStored) || 0 

  const priceServing = final / servingInput

  const percentAdd = parseFloat(priceServing * (percentProfit / 100)) || 0

  profitStored = percentAdd


  totalprofitSpan.textContent = `$${percentAdd.toFixed(2)}
  `
  localStorage.setItem("profit", percentAdd)
}

function removeItem(index){
  items.splice(index, 1)
  prices.splice(index, 1)
  saveData()
  updateLists()
}

function saveData(){
  localStorage.setItem("items", JSON.stringify(items))
  localStorage.setItem("prices", JSON.stringify(prices))
}

  updateLists()

//Send Data to googleSheet

function logToGoogleSheet() {
  document.getElementById("formIngredients").value = document.getElementById("Allitems").textContent;
  document.getElementById("formPrices").value = Array.from(document.querySelectorAll("#connectedList li"))
    .map(li => li.textContent).join(", ");
  document.getElementById("formTotal").value = document.getElementById("totalcost").textContent;
  document.getElementById("formServing").value = document.getElementById("serving-sizes").value;
  document.getElementById("formPercent").value = document.getElementById("percentage-id").value;
  document.getElementById("formProfit").value = document.getElementById("totalprofit").textContent;

  // Debug: check values before sending
  console.log("Sending data:", {
    Sheetingredients: document.getElementById("formIngredients").value,
    pricesSheet: document.getElementById("formPrices").value,
    Sheettotal: document.getElementById("formTotal").value,
    Sheetserving: document.getElementById("formServing").value,
    Sheetpercentag: document.getElementById("formPercent").value,
    Sheetprofit: document.getElementById("formProfit").value
  });

  // Submit hidden form
  document.getElementById("sheetForm").submit();
}


document.querySelector(".finalprice").addEventListener("click", ()=> {
  priceTotal();
  logToGoogleSheet()
})
