const BACKEND_URL = 'http://192.168.13.6:3001';

const config = {
    becomeapartnerapi:` ${BACKEND_URL}/becomePartner`,
   
    loginapi: `${BACKEND_URL}/login`,
  
    verifytoken: `${BACKEND_URL}/verifytoken`,
    getallorgemails: `${BACKEND_URL}/getallorgemails`,
    getalllocationdata: `${BACKEND_URL}/getlocations`,
    getalluserdata: `${BACKEND_URL}/getProfileData`,

    mainapi:`${BACKEND_URL}`
 
};

export default config;