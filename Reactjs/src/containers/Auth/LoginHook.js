import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleLoginApi } from '../../services/userService';
import * as actions from "../../store/actions";
import './Login.scss';

function Login(props) {
    const defaultUser = {
        username: '',
        password: '',
    };

    const dispatch = useDispatch();
    const [user, setUser] = useState(defaultUser);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errMessage, setErrMessage] = useState(null);

    const handleLogin = async() => {
        setErrMessage(null);

        try{
            let data = await handleLoginApi(user.username, user.password);
            if(data && data.errCode !==0){
                setErrMessage(data.message);
            }
            if(data && data.errCode !== 0){
                dispatch(actions.userLoginSuccess(data.user))
                console.log('login succeeds')
            }
        }catch(error) {
            if(error.response) {
                if(error.response.data) {
                    setErrMessage(error.response.data.message);
                }
            }
            
            console.log('hoidanit',error.response)
            
        }
        
    }

    return <>
        <div className="login-background">
            <div className="login-container">
                <div className="login-content row">
                    <div className="col-12 text-login">Login</div>
                    <div className="col-12 form-group login-input">
                        <label>Username:</label>
                        <input type="text" className="form-control"
                            placeholder="viet vao di"
                            value={user.username}
                            onChange={(event) => setUser({ ...user, username: event.target.value })}
                        ></input>
                    </div>
                    <div className="col-12 form-group login-input">
                        <label>Password:</label>
                        <div className='custom-input-password'>
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="viet vao di"
                                value={user.password}
                                onChange={(event) => setUser({ ...user, password: event.target.value })}
                            ></input>
                            <span
                                onClick={() => setIsShowPassword(!isShowPassword)}

                            ><i class={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i></span>
                        </div>
                    </div>
                    <div className='col-md-12' style={{ color: 'red' }}>
                        {errMessage}
                    </div>
                    <div className="col-12">
                        <button className="btn-login" onClick={() => handleLogin()}>Login</button>
                    </div>
                    <div className="col-12">
                        <span className="forgot-password">Forgot you password ?</span>
                    </div>
                    <div className="col-12 text-center mt-3">
                        <span className="text-other-login">Or Login With:</span>
                    </div>
                    <div className="col-12 social-login">
                        <i className="fab fa-google-plus-g google"></i>
                        <i className="fab fa-facebook-f facebook"></i>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default Login;