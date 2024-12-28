import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupSchema } from '../utils/validation';
import api from '../utils/api';
import '../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post('/auth/signup', values);
      navigate('/login');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-input"
                />
                <ErrorMessage name="name" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-input"
                />
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-input"
                />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-input"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </div>

              <button type="submit" disabled={isSubmitting} className="auth-button">
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;