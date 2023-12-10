
import { getUser, resetUserSession } from '../../service/AuthService';
import { useState, useEffect, Fragment } from "react";
import Card from 'react-bootstrap/Card';

function Profile() {
    const user = getUser();
  

 
  return (
    <Fragment>
     <Card className='d-flex justify-content-center align-items-center '>
     <Card.Title>Profile</Card.Title>
      <Card.Body>Email : {user?.email} </Card.Body>
    </Card>
    </Fragment>
  );
}
export default Profile;