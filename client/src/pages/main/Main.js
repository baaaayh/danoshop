import { useState, useEffect } from "react";
import axios from "axios";
import SectionKV from "../../components/SectionKV";
import MainContents from "../../components/MainContents";
import SectionProduct from "../../components/SectionProduct";
import SectionEvents from "../../components/SectionEvents";
import Slogan from "../../components/Slogan";

function Main() {
    const [productList, setProudctList] = useState();

    const getProductList = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product"
            );
            setProudctList(response.data);
        } catch (error) {
            console.error("Error fetching main product list:", error);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);

    return (
        <main className="main">
            <SectionKV />
            <MainContents>
                <SectionProduct
                    title={"마침내 재입고! 간편든든 프로틴 시리얼🌞"}
                    productList={productList}
                    type={"cereal"}
                />
                <SectionProduct
                    title={"푹푹 찌는 폭염엔? 방구석 홈트가 최고🧘‍♂️"}
                    productList={productList}
                    type={"training"}
                />
                <SectionProduct
                    title={"입터짐 방지용 간식+티😋"}
                    productList={productList}
                    type={"dessert"}
                />
                <SectionEvents title={"첫 만남&재구매 혜택🎁"} />
                <SectionProduct
                    title={"촉촉&부드러운 살결의 원조! 다노 닭가슴살 시리즈🐓"}
                    productList={productList}
                    type={"chickenbreast"}
                />
                <SectionProduct
                    title={
                        "여성 전용 맞춤 연구&개발! 다노 단백질 쉐이크 시리즈💪"
                    }
                    productList={productList}
                    type={"convenient"}
                />
                <SectionProduct
                    title={"Better Together🌿"}
                    productList={productList}
                    type={"club"}
                />
                <Slogan />
            </MainContents>
        </main>
    );
}

export default Main;
