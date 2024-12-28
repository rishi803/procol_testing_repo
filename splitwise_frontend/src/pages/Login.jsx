import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginSchema } from '../utils/validation';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import api from '../utils/api';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/login', values);
      dispatch(loginSuccess(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="auth-button"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;