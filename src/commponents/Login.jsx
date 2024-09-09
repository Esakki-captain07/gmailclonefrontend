import React, { useState } from 'react';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ClipLoader from "react-spinners/BarLoader"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      let { message, token } = await AxiosService.post(
        ApiRoutes.LOGIN.path,
        { email, password },
        { authenticate: ApiRoutes.LOGIN.auth }
      );
      sessionStorage.setItem('token', token);
      toast.success(message);
      navigate('/inbox'); 
    } catch (error) {
      toast.error(error.message || 'Internal Server Error');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className='bg'>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                {loading ? (
                  <div className="loader-overlay">
                    <ClipLoader color={"#36d7b7"}  loading={loading} size={70}  aria-label="Loading Spinner" data-testid="loader" />
                  </div>
                ) : (
                  <>
                    <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                    <form>
                      <div className="form-floating mb-3">
                        <input 
                          type="email" 
                          className="form-control"  id="floatingInput"   placeholder="name@example.com"   onChange={(e) => setEmail(e.target.value)} 
                        />
                        <label htmlFor="floatingInput">Email address</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input   type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="floatingPassword">Password</label>
                      </div>
                      <div className="d-grid">
                        <button  className="btn btn-primary btn-login text-uppercase fw-bold" onClick={handleSubmit}>Signin</button>
                      </div>
                      <hr className="my-4" />
                      <div className="text-center">
                        <Link className="small" to="/signin">Sign in</Link>
                      </div>
                     
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
