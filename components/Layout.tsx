import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              
              <Link href="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/login">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup">
                Signup
              </Link>
            </li>
            <li>
              <Link href="/menu">
                Menu
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <hr />
        <p>&copy; My Mess Management System 2023</p>
      </footer>
    </>
  );
};

export default Layout;
