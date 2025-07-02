import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3001"
});
 
// const Api = axios.create({
//   baseURL: "https://loja-virtual-produtos.onrender.com"
// });


export default {
  
  Api
};