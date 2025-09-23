const allowedOrigins = [
    "http://localhost:3000",        // 로컬 프론트 개발용 주소
    "http://localhost:8000",        // 로컬 백엔드 개발용 주소 
    "https://parking.jihun.store"   // 실제 서비스 주소
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      // origin이 허용된 목록에 있거나, origin이 없는 경우(예: Postman 같은 도구)
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  };
  
  module.exports = corsOptions;