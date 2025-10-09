const express = require('express');
const axios = require('axios');
const router = express.Router();

// 서울시 주차 정보 API 프록시
router.get('/parking/:spotCode', async (req, res) => {
  const { spotCode } = req.params;
  const apiKey = process.env.SEOUL_DATA_API_KEY; // 백엔드의 .env 파일에 키를 저장해야 합니다.

  if (!apiKey) {
    return res.status(500).json({ message: '서울시 API 키가 서버에 설정되지 않았습니다.' });
  }

  const apiUrl = `http://openapi.seoul.go.kr:8088/${apiKey}/json/citydata/1/1/${spotCode}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('서울시 API 호출 오류:', error);
    res.status(500).json({ message: '서울시 API에서 데이터를 가져오는 데 실패했습니다.' });
  }
});

module.exports = router;
