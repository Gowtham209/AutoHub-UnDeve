import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utility/axios';
import './SignUp.css'
import { toast } from 'react-toastify';
function SignUp() {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[repassword,setRePassword]=useState('');
  const[error,setError]=useState('');
  const[isSubmitted,setIsSubmitted]=useState(false);
  const navigate = useNavigate();

  function signUpCheck(e)
  {
        
     e.preventDefault(); 
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(!emailRegex.test(email))
     {
        toast.error("Give Appropriate Email Id");
        return;
     }
     const nameRegex = /^[\W\w]/;
     if(!nameRegex.test(username))
     {
      toast.error("Give Appropriate User Name");
        return;
     }
     if(username==null || email==null || password==null)
     {
      toast.error("Enter Appropriate Credential to SignUp");
      return;
     }
      
      let valid=passwordCheck();

      if(valid!='')
      {
        setIsSubmitted(true);
      }

      setError(valid)
      if(valid==='')
      {
       
        async function signup()
        {
         
         try{
          const api="/signup";
          const resp=await axios.post(api,{userName:username,emailId:email,password:password});
          const status=resp.status;
          toast.success("SignUp Successful")
        
          const data=resp.data;
          //console.log("Success")
          
          if(status==200)
          {
            setUsername('');
            setPassword('');
            setEmail('');
            setRePassword('');
            navigate('/login');
          }
         }
         catch (error) {
          console.log("Error Status:", error.response.status);
          console.log("Error Data:", error.response.data);
          toast.error("Error ",error.data)
          setError(error.response.data);
          setIsSubmitted(true);
          setEmail('');
          setTimeout(
            ()=>{
              setError('')
              setIsSubmitted(false)
          }
          ,5000);
        }
      }
      signup();
     
      


      }
  }
  function passwordCheck()
  {
        if(password===repassword)
        { 
          if(password.includes(' '))
          {
            return "No Space is allowed";
          }
          if(password.length<8)
          {
            return "Password Length is Less";
          }

          if(password.split('').some(ele=>'0987654321'.includes(ele)))
          {
              
              if(password.split('').some(ele=>'!@#$%^&*'.includes(ele)) )  
              {
                setIsSubmitted(false);  
                return '';
              }
              else
              {
                return "Password needs Special Characters";
              }
          }
          else 
          {
            return "Password needs Numbers";
          }
          }
        return "Password doesn't Match";
  }


return (
  <>
  <div className="signup-page">
 
  
  <form className='signup-form'>
  <div>SignUp</div>
      <input 
      type="text" 
      placeholder='username*'
      onChange={(e)=>setUsername(e.target.value)}
      value={username}
      autoComplete='true'
      required/>
      <input 
      type="email" 
      placeholder='emailId*'
      onChange={(e)=>setEmail(e.target.value)}
      value={email}
      required/>
      <input 
      type="password" 
      placeholder='password*'
      onChange={(e)=>setPassword(e.target.value)}
      value={password}
      required/>
      <input 
      type="password" 
      placeholder='re-password*'
      onChange={(e)=>setRePassword(e.target.value)}
      value={repassword}
      required/>
      <div>
          <button type='submit' onClick={signUpCheck}>SignUp</button>
      </div>
    {isSubmitted && <p className='error'>{error}</p>}
  </form>
  </div>
  </>
)
}

export default SignUp