import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <hr />
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

function Home() {

  const handleSubmit = async (e) => {
    e.preventDefault();

    const key = process.env.NODE_ENV === 'development' ?
      process.env.REACT_APP_SECRET_PAYU_TEST_KEY : process.env.REACT_APP_SECRET_PAYU_PROD_KEY

    const __HOST__ = 'http://localhost:5000';
    const response = await fetch(`${__HOST__}/payu`, {
      method: "POST",
      body: JSON.stringify({
        key,
        productinfo: "Iphone",
        amount: "1000",
        firstname: "Murali",
        email: "test@example.com",
        surl: `${__HOST__}/verification`,
        furl: `${__HOST__}/verification`,
        phone: '9986789876'
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
    const data = await response.json();
    // console.log(data, 'data')
    if (data.status_code === 200)
      window.location.replace(data.url)
    else
      alert('payu request failed', data.message)
  }
  return (
    <div>
      <button
        onClick={handleSubmit}
      >
        PAY NOW
      </button>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}