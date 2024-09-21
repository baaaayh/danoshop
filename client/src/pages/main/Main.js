import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SectionKV from "../../components/SectionKV";
import MainContents from "../../components/MainContents";
import SectionProduct from "../../components/SectionProduct";
import SectionEvents from "../../components/SectionEvents";
import Slogan from "../../components/Slogan";

function Main({ menu }) {
    const [menuList, setMenuList] = useState({ menu: [] });

    useEffect(() => {
        setMenuList(menu);
    }, [menu]);

    return (
        <main className="main">
            <SectionKV />
            <MainContents>
                <SectionProduct
                    title={"마침내 재입고! 간편든든 프로틴 시리얼🌞"}
                    menu={menuList}
                    type={"cereal"}
                    prevPage={{ category: "home" }}
                />
                <SectionProduct
                    title={"푹푹 찌는 폭염엔? 방구석 홈트가 최고🧘‍♂️"}
                    menu={menuList}
                    type={"training"}
                    prevPage={{ category: "home" }}
                />
                <SectionProduct
                    title={"입터짐 방지용 간식+티😋"}
                    menu={menuList}
                    type={"dessert"}
                    prevPage={{ category: "home" }}
                />
                <SectionEvents title={"첫 만남&재구매 혜택🎁"} />
                <SectionProduct
                    title={"촉촉&부드러운 살결의 원조! 다노 닭가슴살 시리즈🐓"}
                    menu={menuList}
                    type={"chickenbreast"}
                />
                <SectionProduct
                    title={
                        "여성 전용 맞춤 연구&개발! 다노 단백질 쉐이크 시리즈💪"
                    }
                    menu={menuList}
                    type={"convenient"}
                />
                <SectionProduct
                    title={"Better Together🌿"}
                    menu={menuList}
                    type={"club"}
                />
                <Slogan />
            </MainContents>
        </main>
    );
}

export default Main;
