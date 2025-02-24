//  const scriptLink='https://script.google.com/macros/s/AKfycbywqdWmfRw3UOPdR29KKSrohqgMPwC_F8d3q54Q1odeFHuF4xY2QLUz0FcKUB8Be4Tp/exec';
const scriptLink='https://script.google.com/macros/s/AKfycbyGsCM__ZO_sHXx6LGAC9t_ntjOesxJ81G7URSgRw_V47dYOHhNavDjQoQ2sscqlHGi/exec';
const form = document.forms['contact-form']

const popupMessage=document.querySelectorAll(".popupmessage");
form.addEventListener('submit', e => {
  
  e.preventDefault()

  fetch(scriptLink, 
    { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(re => re.text())
    .then(data => {
        console.log("Success:",data);
//       const jsonData = JSON.parse(data);
//       console.log("status:", jsonData.status);

//       console.log("message:", jsonData.message);
//       const h3 = document.createElement("h3");
//   h3.innerText = jsonData.message;
//   popupMessage.appendChild(h3);

//   popupMessage.style.display = "block";
//   setTimeout(() => {
//     popupMessage.style.display = "none";
//   }, 4000);
    })
    .catch(err =>{ 
        console.log('Error!', err);

    })
})


                   
let popup=document.querySelector("#popup");
let popupemail=document.querySelector("#popupemailbutton")
let submit=document.querySelector("#submit");
let div=document.querySelector("#shadow");
let notNow=document.querySelector("#not-now-button");

notNow.addEventListener("click",function(e){
    div.classList.toggle('light')
    });
submit.addEventListener("click",function(e){
    div.classList.toggle('light')
});

popupemail.addEventListener("click",function(e){
    div.classList.toggle('light')
});            

popup.addEventListener("click",function(e){
    div.classList.toggle('light')
});            