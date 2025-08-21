import React from 'react';
import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // State untuk menyimpan inputan
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: username,
        password: password
      });
      
      console.log('Login berhasil:', response.data);
      
      if (response.data.token) { //menyimpan token
        localStorage.setItem('token', response.data.token);
      }
      if (response.status === 200) {
         navigate('/home')
      }
 
    } catch (error) {
      console.error('Regsiter gagal:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Login gagal');
        } else if (error.request) {
          setError('Tidak dapat terhubung ke server');
        } else {
          setError('Terjadi kesalahan');
        }
      } else {
        setError('Terjadi kesalahan tidak terduga');
      }
    } 
    
    if (username == null || username.trim() === "") {
        alert('Username field cannot be empty!');
        document.querySelector<HTMLInputElement>('input[name="username"]')?.focus();
        return;
    }

    if (password == null || password.trim() === "") {
        alert('Password field cannot be empty!');
        document.querySelector<HTMLInputElement>('input[name="password"]')?.focus();
        return;
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          <div className="mx-auto mt-2 h-1 w-16 rounded bg-[#3E5F44]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

         <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <i className="fas fa-user-plus text-[14px]"></i>
            </span>

            {/* Input diberi padding kiri supaya teks tidak menimpa icon */}
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
              <i className="fas fa-lock text-[14px]"></i>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
             <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            className="w-full rounded-lg bg-[#3E5F44] px-4 py-2 mt-5 font-semibold text-white transition hover:bg-[#233526]"
          >
            Login
          </button>
        </form>

        {/* Link ke Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="font-medium text-[#3E5F44] hover:underline">
          Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

