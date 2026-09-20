import { DecodedIdToken } from 'firebase-admin/auth';
declare global {
    namespace Express {
        interface Request {
            user?: DecodedIdToken;
            userId?: string;
        }
    }
}
//# sourceMappingURL=server.d.ts.map