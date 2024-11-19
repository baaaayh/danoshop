import { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import styles from "./SectionKV.module.scss";

function SectionKV() {
    const [kvList, setKvList] = useState([]);

    const getKVList = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/kv");
            setKvList(response.data);
        } catch (error) {
            console.error("Error fetching KV list:", error);
        }
    }, []);

    useEffect(() => {
        getKVList();
    }, [getKVList]);

    console.log(kvList);

    return (
        <section className="section section--kv">
            <div className={styles.section__inner}>
                {kvList.length > 0 && (
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
                        slidesPerGroup={1}
                        loop={true}
                        className={styles.kv}
                    >
                        {kvList.map((kvInfo) => {
                            return (
                                <SwiperSlide
                                    className={styles["swiper-slide"]}
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
                )}
            </div>
        </section>
    );
}

export default SectionKV;
