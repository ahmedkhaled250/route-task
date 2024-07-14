import { roles } from "../../middleware/auth.js";

const endPoint = {
    Client:[roles.Client],
    all:[roles.Client,roles.Admin]
}
export default endPoint