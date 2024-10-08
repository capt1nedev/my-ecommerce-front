import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductBox from "@/components/ProductBox";
import SingleOrder from "@/components/SingleOrder";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react"
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
    margin: 30px 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        display: grid;
        grid-template-columns: 1.2fr .8fr;
        gap: 40px;
        margin: 40px 0;
        p{
            margin: 5px;
        }
    }
    @media screen and (max-width: 767px) {
        & > div {
            order: 2;
        }

        & > div:last-child {
            order: 1;
        }
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;
const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`;

export default function AccountPage() {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [addressLoaded, setAddressLoaded] = useState(true);
    const [wishlistLoaded, setWishlistLoaded] = useState(true);
    const [orderLoaded, setOrderLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Orders');
    const [orders, setOrders] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    async function logout() {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }
    async function login() {
        await signIn('google');
    }
    function saveAddress() {
        const data = { name, email, city, streetAddress, postalCode, country };
        axios.put('/api/address', data).then(() => {
            setSuccessMessage('Saved successfully!')
        }).catch(error => {
            console.error("Failed to save:", error)
        });
    }
    useEffect(() => {
        if (!session) {
            return;
        }
        setAddressLoaded(false);
        setWishlistLoaded(false);
        setOrderLoaded(false);
        axios.get('/api/address').then(response => {
            setName(response.data?.name);
            setEmail(response.data?.email);
            setCity(response.data?.city);
            setPostalCode(response.data?.postalCode);
            setStreetAddress(response.data?.streetAddress);
            setCountry(response.data?.country);
            setAddressLoaded(true);
        });
        axios.get('/api/wishlist').then(response => {
            setWishedProducts(response.data.map(wp => wp.product));
            setWishlistLoaded(true);
        });
        axios.get('/api/orders').then(response => {
            const filteredOrders = response.data.filter(order => order.paid !== false);
            setOrders(filteredOrders);
            setOrderLoaded(true);
        });
    }, [session]);
    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove)]
        });
    }
    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <Tabs
                                    tabs={['Orders', 'Wishlist']}
                                    active={activeTab}
                                    onChange={setActiveTab}
                                />
                                {activeTab === 'Orders' && (
                                    <>
                                        {!orderLoaded && (
                                            <Spinner fullWidth={true} />
                                        )}
                                        {orderLoaded && (
                                            <div>
                                                {orders.length === 0 && (
                                                    <>
                                                        {session ? (
                                                            <p>You don&apos;t have any orders</p>
                                                        ) : (
                                                            <p>Login to see your order</p>
                                                        )}
                                                    </>
                                                )}
                                                {orders.length > 0 && orders.map(o => (
                                                    <SingleOrder key={o._id} {...o} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'Wishlist' && (
                                    <>
                                        {!wishlistLoaded && (
                                            <Spinner fullWidth={true} />
                                        )}
                                        {wishlistLoaded && (
                                            <>
                                                <WishedProductsGrid>
                                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                        <ProductBox key={wp._id} {...wp} wished={true}
                                                            onRemoveFromWishlist={productRemovedFromWishlist} />
                                                    ))}
                                                </WishedProductsGrid>
                                                {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Your wishlist is empty</p>
                                                        )}
                                                        {!session && (
                                                            <p>Login to add products to your wishlist</p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>{session ? 'Account Details' : 'Login'}</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {addressLoaded && session && (
                                    <>
                                        <Input type="text"
                                            placeholder="Name"
                                            value={name}
                                            name="name"
                                            onChange={ev => setName(ev.target.value)} />
                                        <Input type="text"
                                            placeholder="Email"
                                            value={email}
                                            name="email"
                                            onChange={ev => setEmail(ev.target.value)} />
                                        <CityHolder>
                                            <Input type="text"
                                                placeholder="City"
                                                value={city}
                                                name="city"
                                                onChange={ev => setCity(ev.target.value)} />
                                            <Input type="text"
                                                placeholder="Postal Code"
                                                value={postalCode}
                                                name="postalCode"
                                                onChange={ev => setPostalCode(ev.target.value)} />
                                        </CityHolder>
                                        <Input type="text"
                                            placeholder="Address"
                                            value={streetAddress}
                                            name="streetAddress"
                                            onChange={ev => setStreetAddress(ev.target.value)} />
                                        <Input type="text"
                                            placeholder="Country"
                                            value={country}
                                            name="country"
                                            onChange={ev => setCountry(ev.target.value)} />
                                        {successMessage && (
                                            <p style={{ color: 'green' }}>{successMessage}</p>
                                        )}
                                        <Button black block
                                            onClick={saveAddress}>
                                            Save
                                        </Button>
                                        <hr />
                                    </>
                                )}
                                {session && (
                                    <Button primary onClick={logout}>Logout</Button>
                                )}
                                {!session && (
                                    <Button primary onClick={login}>Login with Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    );
}