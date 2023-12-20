import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import './index.scss';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { setDefaultLanguage, setTranslations, setLanguageCookie, setLanguage } from 'react-switch-lang'
import { routes } from './route';
import ConfigDB from './data/customizer/config'
import { classes } from './data/layouts';
import history from './assets/history/history'
import axios from './assets/axios/axios';
import en from './assets/languages/en.json'
import ur from './assets/languages/ur.json'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

const Root = (props) => {
  let user = JSON.parse(window.localStorage.getItem("user"))
  if (user) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + user.token
  }

  setTranslations({ ur, en })
  // setDefaultLanguage("en")
  setLanguageCookie()

  const [anim, setAnim] = useState("");
  const animation = localStorage.getItem("animation") || ConfigDB.data.router_animation || 'fade'
  const abortController = new AbortController();
  const defaultLayoutObj = classes.find(item => Object.values(item).pop(1) === 'compact-wrapper');
  const layout = localStorage.getItem('layout') || Object.keys(defaultLayoutObj).pop();

  useEffect(() => {
    setAnim(animation)
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
    // if (sessionStorage.getItem("lang")) {
    //   const selectedLanguage = sessionStorage.getItem("lang")
    //   console.log(selectedLanguage);
    //   setLanguage(selectedLanguage)
    // }
    return function cleanup() {
      abortController.abort();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <Provider store={store}>
        <Router basename={`/vendor/login`} history={history}>
          <Switch>
            {/* <App>
            <Route exact path={`${process.env.PUBLIC_URL}/`} render={() => {
                return (<Redirect to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`} />)
            }} />
          <TransitionGroup> */}
            {routes.map(({ path, Component }) => (
              <Route key={path} exact path={`${process.env.PUBLIC_URL}${path}`}>
                {({ match }) => (
                  <CSSTransition
                    in={match != null}
                    timeout={100}
                    classNames={anim}
                    unmountOnExit
                  >
                    <div><Component /></div>
                  </CSSTransition>
                )}
              </Route>
            ))}
            {/* </TransitionGroup>
          </App> */}
          </Switch>
        </Router>
      </Provider>
    </Fragment>
  )
}
ReactDOM.render(<Root />,
  document.getElementById('root')
);

serviceWorker.unregister();
