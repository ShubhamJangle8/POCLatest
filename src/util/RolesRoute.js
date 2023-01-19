import { Route } from "react-router-dom";
import PropTypes from 'prop-types';
import LoginService from '../services/LoginService';

const RolesRoute = ({ roles, children, ...rest }) => (
    <Route {...rest}>
      {LoginService.hasRole(roles) ? children : <NotAllowed/>}
    </Route>
  )

  RolesRoute.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }