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

export function getDoctorDetails(data) {
    {


        const accessToken = data.token.access;
        const id = data.id;

        // Step 2: Use the token to call an authenticated API
        const authenticatedUrl = `https://staging-api.urgidoctor.com/api/doctor/getDoctorDetails/${id}`;
        const authRes = http.get(authenticatedUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Log the response from the authenticated request
        console.log(`Authenticated Response: ${authRes.body}`);

        // Validate the authenticated API response
        check(authRes, {
            'authenticated status is 200': (r) => r.status === 200,
            'authenticated response contains expected data': (r) => JSON.parse(r.body).data !== undefined,
        });

        // Simulate user think time
        sleep(1);
    }
}