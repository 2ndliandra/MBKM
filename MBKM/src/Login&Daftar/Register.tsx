import React from 'react';
import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) =>  {
        e.preventDefault();
        setError("");

    const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value || value === "");
    if (error) setError("");
    };

    if (password !== confirmPassword) {
    setError("Password dan konfirmasi password tidak sama!");
    setPasswordMatch(false);
    return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username: username,
        email: email,
        password: password
      });
      
      console.log('Register berhasil:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      if (response.status === 201) {
         navigate('/login')
      }
 
    } catch (error) {
      console.error('Regsiter gagal:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Register gagal');
        } else if (error.request) {
          setError('Tidak dapat terhubung ke server');
        } else {
          setError('Terjadi kesalahan');
        }
      } else {
        setError('Terjadi kesalahan tidak terduga');
      }
    } 
  };
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"> 
        
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Register</h1>
                <div className="mx-auto mt-2 h-1 w-16 rounded bg-[#3E5F44]"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <i className="fas fa-user-plus text-[14px]"></i>
                </span>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <i className="fas fa-envelope text-[14px]"></i>
                </span>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <i className="fas fa-lock text-[14px]"></i>
                </span>

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={ (e) => {
                    setPassword(e.target.value)
                        if (confirmPassword) {
                                    setPasswordMatch(e.target.value === confirmPassword);
                        }
                    }}
                    className="w-full rounded-lg border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
            </div>

            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <i className="fas fa-lock text-[14px]"></i>
                </span>

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>

                {confirmPassword && (
                  <div className="absolute -bottom-5 left-0 text-xs">
                         {passwordMatch ? (
                          <span className="text-green-600">✓ Password cocok</span>
                           ) : (
                         <span className="text-red-600">✗ Password tidak cocok</span>
                         )}
                    </div>
                )}
            </div>
            <button
                type="submit"
                className="w-full rounded-lg bg-[#3E5F44] px-4 py-2 mt-5 font-semibold text-white transition hover:bg-[#233526]"
                >
                Register
            </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Kembali ke halaman{" "}
                <Link to="/login" className="font-medium text-[#3E5F44] hover:underline">
                Login</Link>
            </p>
        </div>
        </div>
    )
}

export default Register;