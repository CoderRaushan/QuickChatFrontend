import React from "react";
import styles from "../components/Register.module.css";
function Register() {
  return (
    <div className={styles.register_main_container}>
      <div className={styles.child_register_container}>
        <h2 className={styles.text}>Registration Form</h2>
        <div className={styles.input_name_container}>
          <label htmlFor="name" className={styles.input_name_container_label}>
            Enter Name:{" "}
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            id="name"
            className={styles.input_name_container_input}
          />
        </div>
        <div className={styles.input_name_container}>
          <label htmlFor="email" className={styles.input_name_container_label}>
            Enter Email:{" "}
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="Email"
            id="email"
            className={styles.input_name_container_input}
          />
        </div>
        <div className={styles.register_submit_btn_container}>
          <form action="">
            <button type="submit" className={styles.verify_button}>
              Get Verification Code:{" "}
            </button>
          </form>
        </div>
        <div className={styles.input_name_container}>
          <label
            htmlFor="verification"
            className={styles.input_name_container_label}
          >
            Enter Verification Code:{" "}
          </label>
          <input
            type="number"
            placeholder="Enter verification Code"
            name="verification"
            id="verification"
            className={styles.input_name_container_input}
          />
        </div>
        <div className={styles.input_name_container}>
          <label htmlFor="age" className={styles.input_name_container_label}>
            Enter Age:{" "}
          </label>
          <input
            type="number"
            placeholder="Enter Age"
            name="age"
            id="age"
            className={styles.input_name_container_input}
          />
        </div>
        <div className={styles.input_name_container}>
          <label htmlFor="age" className={styles.input_name_container_label}>
            Enter Password:{" "}
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="Password"
            id="Password"
            className={styles.input_name_container_input}
          />
        </div>
        <div className={styles.register_submit_btn_container}>
          <form action="">
            <button type="submit" className={styles.verify_button}>
              Submit
            </button>
          </form>
        </div>
        {/* <h3 className={styles.text}>Login With</h3> */}
        <div className={styles.third_party_providers}>
          {/* <div className="google">
            <img
              src={googleImage}
              className={styles.google_image}
            />
          </div>
          <div className="github">
            <img src={githubImage} className={styles.google_image} />
          </div>
          <div className="facebook">
            <img src={facebookImage} className={styles.google_image} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Register;