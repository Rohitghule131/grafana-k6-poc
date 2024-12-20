import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 10 }, // Ramp up to 10 users over 1 minute
        { duration: '3m', target: 10 }, // Hold at 10 users for 3 minutes
        { duration: '1m', target: 0 }, // Ramp down to 0 users over 1 minute
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        'http_req_failed{status:500}': ['rate<0.05'], // Error rate < 5%
    },
};

export default function() {
    const url = 'https://staging-api.urgidoctor.com/api/user/login';
    const body = {
        "email": "athenamedical.stage.physician@yopmail.com",
        "password": "Qwerty@123",
        "role": "PHYSICIAN",
        "fcm_object": {
            "active": 1,
            "registration_id": "cwUgDjWIzDS8cT622rKKKx:APA91bGEAMNCQt_C7iQI6-55s3_Z5jQlXx59UGQFQytNtZ-KRomfkNguag_GXlcETn7T0lYOvFk_dgSOI4nIT8HSzlD0cmuSdB6LfvVvGURZmzkIF5PPlT2j6E5n_Q_u3K5lW-WLH1kk",
            "type": "web",
            "name": "desktop"
        }
    }

    const res = http.post(
        url,
        JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    console.log(res.body)

    // Validate response
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    // Simulate user think time
    sleep(1);
}