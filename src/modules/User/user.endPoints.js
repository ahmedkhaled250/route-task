import { roles } from "../../middleware/auth.js";

const endPoint = {
  allUsers: [roles.Client, roles.Admin],
  blockUser: [roles.Admin],
};
export default endPoint;
