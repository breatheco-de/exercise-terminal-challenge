import React, { Suspense } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Redbox from "redbox-react";

// Carga diferida usando React.lazy
const Presentation = React.lazy(() => import('./slides'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const CustomErrorReporter = ({ error }) => <Redbox error={error} />;

CustomErrorReporter.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired
};

ReactDOM.render(
  <AppContainer errorReporter={CustomErrorReporter}>
    <Suspense fallback={<div>Loading...</div>}>
      <Presentation />
      <AnotherComponent />
    </Suspense>
  </AppContainer>,
  document.getElementById("root")
);

// HMR para recargar componentes cuando se editen
if (module.hot) {
  module.hot.accept("./slides", () => {
    const NextPresentation = require('./slides').default;
    ReactDOM.render(
      <AppContainer errorReporter={CustomErrorReporter}>
        <Suspense fallback={<div>Loading...</div>}>
          <NextPresentation />
        </Suspense>
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
