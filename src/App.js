import { BrowserRouter as Router } from "react-router-dom";

import routes from "./routes";

function App() {
  return (
    <Router>
      <section className="container">
        {routes}
      </section>
    </Router>
  );
}

export default App;