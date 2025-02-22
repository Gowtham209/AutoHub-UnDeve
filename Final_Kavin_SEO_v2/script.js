const scriptLink='https://script.google.com/macros/s/AKfycbywqdWmfRw3UOPdR29KKSrohqgMPwC_F8d3q54Q1odeFHuF4xY2QLUz0FcKUB8Be4Tp/exec';
const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  
  e.preventDefault()
  //console.log(new FormData(form));
  fetch(scriptLink, 
    { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(re => re.text())
    .then(data => {
      const jsonData = JSON.parse(data);
      console.log("status:", jsonData.status);
      alert(jsonData.message)
      console.log("message:", jsonData.message);
      
    })
    .catch(err => console.error('Error!', err.message))
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