import http from 'k6/http';
import { check } from 'k6';

export function login() {
    const url = 'https://staging-api.urgidoctor.com/api/user/login';
    const body = JSON.stringify({
        "email": "athenamedical.stage.physician@yopmail.com",
        "password": "Qwerty@123",
        "role": "PHYSICIAN",
        "fcm_object": {
            "active": 1,
            "registration_id": "cwUgDjWIzDS8cT622rKKKx:APA91bGEAMNCQt_C7iQI6-55s3_Z5jQlXx59UGQFQytNtZ-KRomfkNguag_GXlcETn7T0lYOvFk_dgSOI4nIT8HSzlD0cmuSdB6LfvVvGURZmzkIF5PPlT2j6E5n_Q_u3K5lW-WLH1kk",
            "type": "web",
            "name": "desktop"
        }
    });

    const res = http.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response Body:', res.body);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    let jsonResponse = null;

    try {
        jsonResponse = JSON.parse(res.body);
        console.log('Parsed Response:', jsonResponse);
    } catch (e) {
        console.error('Failed to parse response as JSON:', e.message);
    }

    return jsonResponse.data;
}