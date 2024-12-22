import { login } from "./login_test.js";
import { getDoctorDetails } from "./doctor_details_test.js";
import { searchDoctor } from "./search_doctor_test.js";
import { updateConciergeService } from "./update_concierge_service_test.js";
import { getConciergeService } from "./get_concierge_service_test.js";


export default function() {
    const data = login();
    console.log('IN POC', data.token.access)
    const token = data.token.access;

    getDoctorDetails(data);
    // searchDoctor(token);
    getConciergeService(token);
    updateConciergeService(token);
}