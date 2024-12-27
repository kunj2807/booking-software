import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InputGroup from 'react-bootstrap/InputGroup';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuth } from '../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/auth';

export default function Login() {
    const {login} = useAuth()
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [text, setText] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleText = () => {
        if (text === false) {
            setText(true)
        }
        else {
            setText(false)
        }
    }
    const [data, setData] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const response = await dispatch(loginUser(data)).unwrap();
            if (response.token) {
                localStorage.setItem('token', response.token);
                login(response.token);
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally{
            setLoading(false)
        }
    }

    const handleRegister = () => {
        navigate('/register')
    }

    return (
        <section className="background-radial-gradient overflow-hidden h-100 w-100">
            <div className="container px-4 py-1 px-md-5 text-center text-lg-start my-3 h-100 w-100">
                <div className="row gx-lg-5 align-items-center justify-content-center mb-5 h-100 w-100">
                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                                <form onSubmit={handleLogin}>
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="email">Email</label>
                                        <input type="email" name='email' id="email" value={data.email} onChange={(e) => { handleChange(e) }} className="form-control" />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="password">Password
                                        </label>
                                        <InputGroup className="mb-3">
                                            <input type={text ? 'text' : 'password'} name="password" value={data.password} onChange={(e) => { handleChange(e) }} className="form-control" />
                                            <InputGroup.Text id="password" onClick={handleText} style={{ cursor: 'pointer' }}>
                                                {text && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>}
                                                {!text && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                                </svg>}
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                    <LoadingButton
                                        size="small"
                                        loading={loading}
                                        onClick={handleLogin}
                                        className="mb-4"
                                        variant="contained"
                                        color="secondary"
                                        style={{ background: '#273b5e !important' }}
                                    >
                                        <span>LOGIN</span>
                                    </LoadingButton>

                                    <LoadingButton
                                        size="small"
                                        loading={loading}
                                        onClick={handleRegister}
                                        className="mb-4"
                                        variant="contained"
                                        style={{ background: '#273b5e !important', marginLeft: '20px' }}
                                    >
                                        <span>REGISTER</span>
                                    </LoadingButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
