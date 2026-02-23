import React from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>📝 Sign Up Page</h1>
      <p>This is a placeholder. Click below to go to dashboard.</p>
      <Link to="/dashboard" style={{ color: '#667eea' }}>Go to Dashboard</Link>
    </div>
  );
}

export default SignUp;
