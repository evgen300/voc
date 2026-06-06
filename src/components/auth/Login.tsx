'use client'

import React, { useState } from "react";
//import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/context/modules/AuthContext";

export default function Login() {

  const { status, signIn, register } = useAuthContext();
  //const { t } = useTranslation();
  const [ mode, setMode ] = useState("login");
  const [ error, setError ] = useState("");

  const handleSubmitForm = async function (formData: any) {
    setError("");
    const data = Object.fromEntries(formData);
    if (mode === "register") {
      const res = await register(data);
      if (res.success === false) {
        setError("err_" + res.data.error);
      } else {
        switchMode();
      }
    } else {
      try {
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        console.log(res);
        if (res.error) {
          setError("err_" + res.error.replace(/Error\:\s*/, ''));
        }
      } catch (e: any) {
        console.log(e);
        setError("err_" + e.error.replace(/Error\:\s*/, ''));
      }
    }
  }
  const switchMode = function() {
    setError("");
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
  }

  return (
    <div className="register-form">
      <form action={ handleSubmitForm }>
        { mode === "login" ? (
          <div className="form-fields">
            <div className="form-row">
              <div className="form-field">
                <label>email</label>
              </div>
              <div className="form-field">
                <input type="text" name="email" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>password</label>
              </div>
              <div className="form-field">
                <input name="password" type="password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
              </div>
              <div className="form-field">
                <button className="button -primary" type="submit">login</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="form-fields">
            <div className="form-row">
              <div className="form-field">
                <label>name</label>
              </div>
              <div className="form-field">
                <input type="text" name="name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>email</label>
              </div>
              <div className="form-field">
                <input type="text" name="email" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>password</label>
              </div>
              <div className="form-field">
                <input name="password" type="password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
              </div>
              <div className="form-field">
                <button className="button -primary" type="submit">register</button>
              </div>
            </div>
          </div>
        ) }
      </form>
      { error.length > 0 ? (
        <div className="login-error">
          { error }
        </div>
      ) : '' }
      <div className="switch-mode">
        <button onClick={() => {
          switchMode()
        }}>{ mode === "login" ? "register_link" : "login_link" }</button>
      </div>
    </div>
  )
}