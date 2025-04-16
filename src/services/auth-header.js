export default function authHeader() {
  const userToken = localStorage.getItem('userToken');
  
  if (userToken) {
    return { 
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
}
