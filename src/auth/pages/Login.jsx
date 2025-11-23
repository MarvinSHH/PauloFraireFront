import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosEyeOff } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";
import clientAxios from "../../config/clientAxios";
import ErrorHandler from "../../components/ErrorHandler";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUser = {
      email: user.email.trim(),
      password: user.password.trim(),
    };

    if (cleanUser.email === "" || cleanUser.password === "") {
      toast.error("No puede haber campos vacíos");
      return;
    }

    setLoading(true);
    try {
      const response = await clientAxios.post("/login", {
        ...cleanUser,
      });

      if (response.status === 200) {
        const userData = response.data.user;

        localStorage.setItem("token", JSON.stringify(userData));

        if (userData.role === 0) {
          navigate("/user/profile");
        } else if (userData.role === 1) {
          navigate("/admin/home");
        } else if (userData.role === 2) {
          navigate("/admin/home");
        } else {
          toast.error("Rol desconocido. Contacta al administrador.");
        }
      }
    } catch (error) {
      let mensaje = "Ocurrió un error inesperado";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          mensaje = error.response.data;
        } else if (error.response.data.message) {
          mensaje = error.response.data.message;
        } else if (error.response.data.msg) {
          mensaje = error.response.data.msg;
        }
      } else if (error.message) {
        mensaje = error.message;
      }
      setError({ message: mensaje, status: error.response?.status });
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const updateState = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow shadow-slate-300 my-16 from-sky-800 to-blue-100">
      <h1 className="text-4xl font-bold text-center text-slate-700">
        Iniciar Sesión
      </h1>

      <form onSubmit={handleSubmit} className="my-5">
        <div className="flex flex-col space-y-5">
          <div>
            <label htmlFor="email" className="font-medium text-slate-700 pb-2">
              Correo:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-auth"
              placeholder="Ingrese su Email"
              defaultValue={user.email}
              onChange={updateState}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-medium text-slate-700 pb-2"
            >
              Contraseña:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="input-auth"
                placeholder="Ingrese su Contraseña"
                defaultValue={user.password}
                onChange={updateState}
              />
              <IoIosEyeOff
                className={`absolute top-1/2 right-3 transform -translate-y-1/3 hover:cursor-pointer hover:scale-110 ${
                  showPassword ? "text-blue-600" : "text-slate-500"
                }`}
                onClick={togglePassword}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <Link to="/olvide-password" className="font-medium text-blue-600">
              Recuperar Contraseña?
            </Link>
          </div>

          {!loading ? (
            <button className="btn-action">
              <IoLogIn className="w-6 h-6" />
              <span>Login</span>
            </button>
          ) : (
            <Spinner />
          )}
        </div>
      </form>

      <ErrorHandler error={error} />
    </div>
  );
};

export default Login;
