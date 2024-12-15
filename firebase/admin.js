import admin from "firebase-admin";

const serviceAccountKey = {
  type: "service_account",
  project_id: "foodoffers-2cedb",
  private_key_id: "7325d4492ac6480f1221b287766fde23ffb7a304",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuhvlM8nzcOuRL\nMbkIvujxUn/QS5/Cb3yeDjAXbH9VqrrjLgcDxJWaOlVXFYNvy2MTwr7blPrgn9mR\n5L1Qx8CpZ5qTv3jQKkpKcXgDUHqMpvXyPgOKQTfERKE0WcZotZRpzfiAD33HxhfI\n042UXRZs5XUVpAajvAMdepG8AR8sWxRU7skKhjmkQOJru93q9WuRJlSkpmcZwu/y\nZdfUvU/xvVOpsJucy8fNf5VpujVoQUkLv97i54glIZX/LwEbYym1io4bZruYxA6A\nlyVSzt3AFcKBmdnHo3Gam4EFT8GUcMKVUvHzl7W7SBInCGZC3oOBcGZB1wdAzkSD\nZw5hRCcpAgMBAAECggEAIUpjwXa7tHKTW3iHmBB6dJXNBZl3RupnNer053LtsxSX\nA4CjG+fitYGNB8h1wtxj8MAEEfSQCkrTgI3GQuNnb6jwhmBOlj6K3zpXryIpziyG\n24dSu4uHLKv+p/K78vs37Rq53QuXbYTuwoMADZ3YCjuWouMf1Rmm6neX1unL3XTN\ndaBKZ5epbuH/g4t9qeByBysAVdna38QtCu/FI57v2oaD9Nh1+n6SKBi7PDoZl2nV\nQ7jtSiIn9ZSrO3A28RLdYxnnkY5tc+kFaXXVo/k9Kmcf9zoAT3xI9HdXiJYX+liT\nABfypdxRJWoU9ey+2okL+TftcSFaWE+3rpOuIheaZQKBgQDZ+iqNAR4wGdABPQ37\nkx/H1MhaI0jogv9c0xLuwSL994dwMNdvF6FNFfr+msgLkZ/qdWC1r8pLslwkpsdN\nxdYUWD84KK/zBZoD/ai9YOEKFVyz8wR00X9/89rbEgIL/N20KiDGiwrnopyu7IZH\nkbF+YYqQyGGZfUAgafK7gP6XrwKBgQDM+Il2A2zj3rNYIUlKSKMpkd+4GNb6TnQv\nGo5mBwxLBpekc+eNpmQc1JQ6TvhFCytMP3UniiiZhyJl2tKW/Hlk8aytGDW/yGC2\nMTJ0HPTeV+xEBM5K8an3Pz+yLW3EU9dYNYXzq5OQEqomtwCUDD7Dq5prRcFKlsSN\nWiiZxt0MpwKBgQDJusgebuZtRbZHLyX9qY9D9RzmrrkO1g1W7tEavQuRVr+1iL4Y\nRho1qR38+2ofqsoAxliWTPY/T/YOxXq1813IvlLjumP72TdMcjjz6vDZ0CNXNpTt\nN+VzmU72Z5gVWBQmZMaoeI3DCa9QA/3RxngpqkP+8jPBRTVPyj2mYh88aQKBgQDB\nhiObJg7IcvrXyc298ikDVbRpyCIpgKtX0fYCxMLJj3bbkYddiW1afydYijkET1BZ\nFE0TwPEmS52hl2Jfpg8jzL6hS4tsAM+3FWoykShtSYxMiFESF2vHgpMsMpJB3Hsk\n0Jwhfay8SbMXDI/iOFGGQ15vzBN8zi7T2v0ce9M3XwKBgB3ejjm6N2YFU2ajX9NW\n0fQtTo8QLjKVyANrABDOdpulcc7v3/tt4NB00h+Va/Vu1AI+Bc9v5zPQ6fIpCMbM\nkIbSXKH/AN3Qc2G4nJQ125bst2uSzKfhaiMAvPO2Emy8azO0vZQB2xS217gUsJd/\nNQc/sg0scTesR5aveeCgBZSk\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-69bn9@foodoffers-2cedb.iam.gserviceaccount.com",
  client_id: "111471196520589520726",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-69bn9%40foodoffers-2cedb.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL:
    "https://foodoffers-2cedb-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();
const rtdb = admin.database();

export { admin, db, rtdb };
