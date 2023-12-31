import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";

const StyledHeader = styled.header`
    background-color: #222;
    position: sticky;
    top: 0;
    z-index: 10;
`;
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;
const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;
const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none; 
    padding: 10px 0;
    min-width: 30px;
    svg{
        height: 30px;
    }
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;
const NavButton = styled.button`
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;
const SideIcons = styled.div`
    display: flex;
    align-items: center;
    a{
        display: inline-block;
        min-width: 20px;
        color: white;
        svg{
            width: 14px;
            height: 14px;
        }
    }
`;
const SvgIcon = styled.svg`
  fill: #fff;
  width: 24px;  // Adjust the size as needed
  height: 24px; // Adjust the size as needed
  margin-right: 10px; // Adjust the spacing as needed
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>
                        <SvgIcon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 375 375"
                            >
                                <defs>
                                    <clipPath id="fc0ee6c127">
                                        <path d="M33.047 33.047H293V254H33.047zm0 0"></path>
                                    </clipPath>
                                </defs>
                                <path
                                    fill="#fff"
                                    d="M327.309 121.887c.859 1.746 1.68 3.652 2.464 5.511a152.745 152.745 0 0110.2 35.489 155.239 155.239 0 011.945 24.613c0 20.836-4.086 41.063-12.145 60.117-7.777 18.39-18.91 34.91-33.086 49.082-14.175 14.176-30.687 25.313-49.078 33.094-19.05 8.059-39.277 12.156-60.113 12.156s-41.066-4.058-60.117-12.117c-16.531-6.992-31.543-16.602-44.707-28.828h104.816c62.528 0 113.399-50.969 113.399-113.488 0-8.453-.934-16.73-2.696-24.72H187.5v.083c-13.773.008-24.762 11.164-24.762 24.781 0 13.617 11.098 24.781 24.75 24.781h60.973c-3.266 7.98-8.14 15.356-14.469 21.68-12.422 12.414-28.937 19.172-46.504 19.172-17.566 0-34.082-6.828-46.5-19.223-12.425-12.41-19.273-28.922-19.273-46.492 0-17.574 6.851-34.086 19.285-46.492 12.422-12.399 28.934-19.207 46.508-19.207zm0 0"
                                ></path>
                                <g clipPath="url(#fc0ee6c127)">
                                    <path
                                        fill="#aaa"
                                        d="M33.078 187.508c0-20.836 4.086-41.082 12.145-60.13 7.777-18.39 18.91-34.91 33.086-49.081 14.175-14.176 30.687-25.317 49.078-33.094 19.05-8.055 39.277-12.156 60.113-12.156s41.063 4.058 60.117 12.117c16.531 6.992 31.543 16.602 44.707 28.824H187.5c-62.527 0-113.395 50.961-113.395 113.489 0 24.511 7.817 47.18 21.094 65.886H47.77c-.882-1.992-1.734-3.797-2.542-5.715-8.063-19.058-12.149-39.296-12.149-60.14zm0 0"
                                    ></path>
                                </g>
                            </svg>
                        </SvgIcon>
                        GadgetOne
                    </Logo>
                    <StyledNav mobileNavActive={mobileNavActive}>
                        <NavLink href={'/'}>Home</NavLink>
                        <NavLink href={'/products'}>All products</NavLink>
                        <NavLink href={'/categories'}>Categories</NavLink>
                        <NavLink href={'/account'}>Account</NavLink>
                        <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
                    </StyledNav>
                    <SideIcons>
                        <Link href={'/search'}><SearchIcon /></Link>
                        <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}