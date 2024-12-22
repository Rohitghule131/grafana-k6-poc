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
        http_req_failed: ['rate<0.05'], // Error rate < 5%
    },
};

export function searchDoctor(token) {
    {

        const accessToken = token;

        const authenticatedUrl = `https://staging-api.urgidoctor.com/api/doctor/searchDoctor/?search=athena&page=1 `;
        const body = JSON.stringify({
            "patient_detail_id": "277",
            "request_sorting_field": {}
        });

        const authRes = http.post(authenticatedUrl, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Searched doctor Response: ${authRes.body}`);

        check(authRes, {
            'Searched doctor status is 200': (r) => r.status === 200,
            'Searched doctor response contains expected data': (r) => JSON.parse(r.body).data !== undefined,
        });

        // Simulate user think time
        sleep(1);
    }
}