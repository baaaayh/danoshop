import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./SectionKV.scss";

function SectionKV() {
    const [kvList, setKvList] = useState([]);

    const getKVList = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/kv");
            setKvList(response.data); // Correctly access response data
        } catch (error) {
            console.error("Error fetching KV list:", error);
        }
    };

    useEffect(() => {
        getKVList(); // 컴포넌트가 마운트될 때 데이터 가져오기
    }, []);

    return (
        <section className="section section--kv">
            <div className="section__inner">
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect={"fade"}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    speed={1300}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    className="kv"
                >
                    {kvList.map((kvInfo) => {
                        return (
                            <SwiperSlide
                                className="swiper-slide"
                                key={kvInfo.id}
                            >
                                <img
                                    src={`uploads/kv/${kvInfo.image}`}
                                    alt=""
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}

export default SectionKV;
