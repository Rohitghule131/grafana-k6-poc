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

export function getConciergeService(token) {
    {

        const accessToken = token;

        const authenticatedUrl = `https://staging-api.urgidoctor.com/api/doctor/getConciergeService`;

        const authRes = http.get(authenticatedUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Get concierge service Response: ${authRes.body}`);

        check(authRes, {
            'Get concierge service status is 200': (r) => r.status === 200,
            'Get concierge service response contains expected data': (r) => JSON.parse(r.body).data !== undefined,
        });

        sleep(1);
    }
}