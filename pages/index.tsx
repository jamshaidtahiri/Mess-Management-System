// import Layout from '../components/Layout';
import Link from 'next/link'

const Home = () => {
  return (
    <div>
    <h1>Welcome to the Mess Management System</h1>
    <p>
        This is a mess management system designed to help manage mess activities
        and food distribution in a seamless and efficient manner.
      </p>
    <p>This is a basic implementation of a mess management system using Next.js.</p>
    <p>Please login or signup to access the dashboard.</p>
    <Link href="/login">
      Login
    </Link>
    <br />
    <Link href="/signup">
      Signup
    </Link>
  </div>
    
  );
};

const HomePage = () => {
  return (
    // <Layout>
      <Home />
    // </Layout>
  );
};

export default HomePage;
