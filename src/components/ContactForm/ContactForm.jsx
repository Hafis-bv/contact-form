import { useState } from "react";
import s from "./style.module.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-override.scss";
import ReCAPTCHA from "react-google-recaptcha";
import { required } from "../../utils/validation";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    gender: null,
    captcha: null,
  });

  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: required(formData.name, "Please enter your name!"),
      email: required(formData.email, "Please enter your email!"),
      gender: required(formData.gender, "Please choose a gender"),
      captcha: required(
        captchaValue,
        "Please complete the CAPTCHA to continue!"
      ),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
    });

    console.log(formData);
  };

  return (
    <div className={s.box}>
      <h1 className={s.title}>Contact Form</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            className={errors.name && s.inputError}
            type="text"
            placeholder="Enter your name..."
            value={formData.name}
            name="name"
            onChange={handleChange}
          />
          {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            className={errors.email && s.inputError}
            type="email"
            placeholder="Enter your email..."
            value={formData.email}
            name="email"
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <PhoneInput
          onlyCountries={["us", "az", "tr"]}
          country={"az"}
          placeholder="Enter your number..."
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: `+${value}` })}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <select
            className={errors.gender && s.inputError}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select a gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          {errors.gender && (
            <span style={{ color: "red" }}>{errors.gender}</span>
          )}
        </div>
        <div>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={setCaptchaValue}
          />
          {errors.captcha && (
            <span style={{ color: "red", marginTop: 4 }}>{errors.captcha}</span>
          )}
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
};
