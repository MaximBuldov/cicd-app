import { Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';

export const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link className="App-link" to="/posts">
          Check posts
        </Link>
      </header>
    </div>
  );
};
