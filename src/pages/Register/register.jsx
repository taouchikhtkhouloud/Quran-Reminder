import { Fragment, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { setUserSession } from '../../service/AuthService'
const registerUrl = 'https://4kk1d643zc.execute-api.us-east-1.amazonaws.com/prod/register';
import { useNavigate } from 'react-router-dom';
function Register() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const history = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    if ( email.trim() === '' ||  password.trim() === '') {
      setMessage('All fields are required');
      return;
    }
    setMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'fdh7do8qpa9z2q8ZOxYd05qPDWnHeoN82nbzc7Nu'
      }
    }
    const requestBody = {
      email: email,
      password: password
    }
    axios.post(registerUrl, requestBody, requestConfig).then(response => {
      setMessage('Registeration Successful');
      alert('Registeration Successful , a verification email has been sent to your email address , please confirm it to login !');
      history('/login');
    }).catch(error => {
      if (error.response.status === 401) {
        setMessage(error.response.data.message);
      } else {
        setMessage('sorry....the backend server is down!! please try again later');
      }
    })
  }
  
  return (
    <Fragment>
     <section  >
      <div className="container  mb-4">
        <div className="row d-flex justify-content-center align-items-center ">
          <div className="col col-xl-10 ">
            <div className="card" style={{ borderRadius: '1rem' }}>
              <div className="row g-0  d-flex justify-content-center align-items-center">
               
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black  d-flex justify-content-end align-items-end">
                    <form  method="post" >
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <span className="h1 fw-bold mb-0" style={{color:"#ca9142"}}>Create your account</span>
                      </div>
                        {message && <p className="message text-danger">{message}</p>}


                      <div className="form-outline mb-4 ">
                        <label className="form-label" htmlFor="form2Example17">Email address</label>
                        <input type="email" id="form2Example17" className="form-control form-control-lg" onChange={(event)=>setEmail(event.target.value)} />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example27">Password</label>
                        <input type="password" id="form2Example27" className="form-control form-control-lg" onChange={(event)=>setPassword(event.target.value)} />
                      </div>

                      <div className="pt-1 mb-4">
                        <button className="btn btn-dark btn-lg btn-block"  type="submit" onClick={submitHandler}>Register</button>
                      </div>

                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>You have an account? <a href="/login" style={{ color: '#393f81' }}>Sign in here</a></p>
                     
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Fragment>
  );
}

export default Register;