export const CENTER_INFO: Record<
  string,
  { address: string; latitude: number; longitude: number }
> = {
  강남: { address: "서울특별시 강남구 강남대로 396", latitude: 37.4979, longitude: 127.0276 },
  판교: { address: "경기도 성남시 분당구 판교역로 160", latitude: 37.3948, longitude: 127.1112 },
  마곡: { address: "서울특별시 강서구 마곡중앙8로 71", latitude: 37.5599, longitude: 126.8302 },
  광교: { address: "경기도 수원시 영통구 광교호수공원로 80", latitude: 37.291, longitude: 127.045 },
  동탄: { address: "경기도 화성시 동탄순환대로 537", latitude: 37.2007, longitude: 127.0734 },
  성수: { address: "서울특별시 성동구 아차산로 113", latitude: 37.5447, longitude: 127.0559 },
  용산: { address: "서울특별시 용산구 한강대로 405", latitude: 37.5298, longitude: 126.9648 },
};

export const CENTER_KEYS = Object.keys(CENTER_INFO);
