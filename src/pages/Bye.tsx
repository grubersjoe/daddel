import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const SignOut: React.FC = () => (
  <Layout>
    <h1>Ade gell</h1>
    <Link to="/">Erneut anmelden</Link>
  </Layout>
);

export default SignOut;
