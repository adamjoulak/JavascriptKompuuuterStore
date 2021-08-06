/**
 * get elements by id
 */
 const balanceElement = document.getElementById("accountBalance");
 const payElement = document.getElementById("pay");
 const payCreditBtn = document.getElementById("payCredit");
 const bankPayBtn = document.getElementById("bankPayBtn");
 const workBtn = document.getElementById("workBtn");
 const getCreditBtnEL = document.getElementById("getCredit");
 const pcDropdownEl = document.getElementById("pcDropdownEl");
 const pcFeaturesEl = document.getElementById("pcFeaturesEl");
 const pcImgEl = document.getElementById("image");
 const pcName = document.getElementById("pcName");
 const pcDesc = document.getElementById("description");
 const pcPriceEl = document.getElementById("price");
 const loanElement = document.getElementById("loan");
 const buyButton = document.getElementById("buy");
 
 const APIURL = "https://noroff-komputer-store-api.herokuapp.com/";
 let balance = 0;
 let pay = 0;
 
 /**
  * fetch request to get array of pcs (JSON)
  */
 fetch(APIURL + "computers")
     .then(response => response.json())
     .then(data => computers = data)
     .then(computers => addPcsToList(computers))
     .catch((error) => {
         console.log(error)
     });
 /**
  * adds PCs to dropdown menu
  * @param {*} computers An array of computers
  */
 const addPcsToList = (computers) => {
     computers.forEach(element => addPcToList2(element));
 
     //First render
     showPC(computers[0]);
 }
 /**
  *  adds PC to dropdown menu
  * @param {*} computer the pc to add 
  */
 const addPcToList2 = (computer) => {
     const computerElement = document.createElement("option");
     computerElement.value = computer.id;
     computerElement.appendChild(document.createTextNode(computer.title));
     pcDropdownEl.appendChild(computerElement);
 }
 /**
  * shows selected pc info (Event)
  * @param event
  */
 const selectPC = event => {
     const selectedComputer = computers[event.target.selectedIndex];
 
     showPC(selectedComputer);
 }
 /**
  * gets a pcs features
  * @param computer 
  * @returns  features
  */
 const getFeatures = (computer) => {
     let features = "";
     for (let i = 0; i < computer.specs.length; i++) {
         features += computer.specs[i] + "\n";
     }
     return features;
 }
 /**
  * shows description of a selected pc
  * @param {*} computer 
  */
 const showPC = (computer) => {
    pcFeaturesEl.innerText = getFeatures(computer);
    pcName.innerText = computer.title;
    pcDesc.innerText = computer.description;
    pcPriceEl.innerText = computer.price + " $";
    pcImgEl.src = APIURL + computer.image;
 }
 /**
  * Shows users accaount balance
  */
 const showAccountBalance = () => {
     balanceElement.innerText = balance + " $";
     payElement.innerText = pay + " $";
     loanElement.innerText = loan + " $";
     if (loan > 0) {
        payCreditBtn.style.display = "block";
         loanContainer.style.visibility = "visible";
     } else {
        payCreditBtn.style.display = "none";
         loanContainer.style.visibility = "hidden";
     }
 
 }
 /**
  * function to get a loan
  */
 const getLoan = () => {
     if (loan > 0) {
         alert("You cannot have more than 1 loan, pay up first");
     } else {
         const wantedLoan = prompt("How much credit do you need? Cannot be more than double of your balance");
         if (wantedLoan === null) {
             return;
         }
         if (parseInt(wantedLoan) <= 0 || parseInt(wantedLoan) > (balance * 2)) {
             alert("Too high of an amount");
         } else {
             balance += parseInt(wantedLoan);
             loan = parseInt(wantedLoan);
         }
     }
     showAccountBalance();
 }
 /**
  *  adds the pay to the balance minus 10% of the pay if a loan is active
  */
 const addPayToBalance = () => {
     if (loan > 0) {
         if ((pay / 100) * 10 > loan) {
             pay -= loan;
             loan = 0;
         } else {
             loan -= (pay / 100) * 10;
             pay = (pay / 100) * 90
         }
 
     }
     balance += pay;
     pay = 0;
 
     showAccountBalance();
 }
 /**
  * adds worked money to paycheck
  */
 const addToPay = () => {
     pay += 100;
     showAccountBalance();
 }
 /**
  * Pays the loan with paycheck
  */
 const payLoanCredit = () => {
     if (pay > loan) {
         pay -= loan;
         loan = 0;
     } else {
         loan -= pay;
         pay = 0;
     }
 
     showAccountBalance();
 }
 /**
  * function to buy a pc if it is possible
  */
 const buyPC = () => {
     const selectedComputer = computers[document.getElementById("pcDropdownEl").value - 1];
     if (selectedComputer.stock <= 0) {
         alert(`${selectedComputer.title} is not in stock`)
     } else if (balance < selectedComputer.price) {
         alert(`You do not have sufficient balance for: ${selectedComputer.title}`)
     } else {
         selectedComputer.stock--;
         balance -= selectedComputer.price;
         alert(`Congratulations, you now own: ${selectedComputer.title}`);
     }
 
     showAccountBalance();
 }
 
 /**
  * eventlisteners eventlisteners 
  */
pcDropdownEl.addEventListener("change", selectPC);
getCreditBtnEL.addEventListener("click", getLoan);
bankPayBtn.addEventListener("click", addPayToBalance);
workBtn.addEventListener("click", addToPay);
payCreditBtn.addEventListener("click", payLoanCredit);
buyButton.addEventListener("click", buyPC);